import datetime
from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from inventory.forms import (CategoryForm,ProductForm,
                             InventoryIncrementForm,InventoryDecrementForm)
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONDeleteView)
from inventory.models import (Category,Product,
                                InventoryIncrement,InventoryDecrement)
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from inventory.helpers import (prepare_changes_data,historate_stock,
                                group_by_day,sort_time)
from django.utils.decorators import method_decorator
from custom.decorators import access_required
from django.contrib.auth.mixins import LoginRequiredMixin
#helper views
# return name and id of product categorys
class CatIdFace(JSONQueryView):
    model = Category

    def make_query(self,ask=None):
        categorys = super().make_query(ask)
        data = []
        for category in categorys:
            data.append({'id':category['id'],'value':category['name']})
        return data

class ProdIdFace(JSONQueryView):
    model = Product

    def make_query(self,ask=None):
        products = super().make_query(ask)
        data = []
        for product in products:
            data.append({'id':product['id'],'value':product['name']})
        return data
# This view loads in the app
@method_decorator(access_required('inventory'), name='dispatch')
class AppInit(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'inventory/index.html'

#Views for category model
#create view
class CreateCategory(JSONCreateView):
    form = CategoryForm
    model = Category
#update view
class UpdateCategory(JSONUpdateView):
    form = CategoryForm
    model = Category
#delete view
class DeleteCategory(JSONDeleteView):
    model = Category
#query view
class Categorys(JSONQueryView):
    model = Category

#Views for product model
#create view
class CreateProduct(JSONCreateView):
    form = ProductForm
#update view
class UpdateProduct(JSONUpdateView):
    form = ProductForm
    model = Product
    defaults = ["category"]
#delete view
class DeleteProduct(JSONDeleteView):
    model = Product
#query view
class Products(JSONQueryView):
    model = Product

    def make_query(self,ask=None):
        products =  super().make_query(ask)
        for product in products:
            try:
                product["category_id"] = Category.objects.get(pk=product["category_id"]).name
            except ObjectDoesNotExist:
                product["category_id"] = None
        return products
#query view
class Productt(JSONQueryView):
    model = Product

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        try:
            product =  list(self.model.objects.filter(pk=self.kwargs['pk'], bussiness=bussiness, branch=branch).values())[0]
            try:
                product["category_id"] = Category.objects.get(pk=product["category_id"]).name
            except ObjectDoesNotExist:
                product["category_id"] = None
            finally:
                product["status"] = True
        except IndexError:
            product={}
            product["status"] = False
        return product

# Views for increment model
#create increment
class CreateInventoryIncrement(JSONCreateView):
    form = InventoryIncrementForm
    model = InventoryIncrement
    defaults = {'id':'product'}
    user_required = True
#query increment all
class InventoryIncrements(JSONQueryView):
    model = InventoryIncrement

    def make_query(self,ask=None):
        changes = list(self.model.objects.filter(**ask).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#query increment purchases
class InventoryIncrementsPurchase(JSONQueryView):
    model = InventoryIncrement

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        changes = list(self.model.objects.filter(content_type__model__in=["creditpurchase","inventorypurchase"], bussiness=bussiness, branch=branch).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#query increment salesreturns
class InventoryIncrementsSR(JSONQueryView):
    model = InventoryIncrement

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        changes = list(self.model.objects.filter(content_type__model__in=["creditsalesreturn","inventorysalesreturn"], bussiness=bussiness, branch=branch).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#query increment others
class InventoryIncrementsOT(JSONQueryView):
    model = InventoryIncrement

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        changes = list(self.model.objects.exclude(content_type__model__in=["creditsalesreturn","inventorysalesreturn","creditpurchase","inventorypurchase"]).filter(bussiness=bussiness, branch=branch).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#Views for decrement model
#create decrement
class CreateInventoryDecrement(JSONCreateView):
    form = InventoryDecrementForm
    model = InventoryDecrement
    defaults = {'id':'product'}
    user_required = True
#query decrement
class InventoryDecrements(JSONQueryView):
    model = InventoryDecrement

    def make_query(self,ask=None):
        changes = list(self.model.objects.filter(**ask).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#query increment purchases
class InventoryDecrementsSale(JSONQueryView):
    model = InventoryDecrement

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        changes = list(self.model.objects.filter(content_type__model__in=["creditsale","inventorysale"], bussiness=bussiness, branch=branch).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#query increment salesreturns
class InventoryDecrementsPR(JSONQueryView):
    model = InventoryDecrement

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        changes = list(self.model.objects.filter(content_type__model__in=["creditpurchasereturn","inventorypurchasereturn"], bussiness=bussiness, branch=branch).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes
#query increment others
class InventoryDecrementsOT(JSONQueryView):
    model = InventoryDecrement

    def make_query(self,ask=None):
        bussiness = ask['bussiness']
        branch = ask['branch']
        changes = list(self.model.objects.exclude(content_type__model__in=["creditpurchasereturn","inventorypurchasereturn","creditsale","inventorysale"]).filter(bussiness=bussiness, branch=branch).order_by('-timestamp').values())
        prepare_changes_data(changes)
        return changes

class InventoryTracker(View):

    def get(self, request, *args, **kwargs):
        if request.GET:
            b = request.GET['b']
            e = request.GET['e']
            p = request.GET['p']
            data = {}
            data['summary'] = self.process_summary(request,b,e,p)
            gdat = self.process_graph(request,b,e,p)
            # raise Exception("Break")
            prepare_changes_data(gdat['inc'])
            data['inc'] = gdat['inc']
            prepare_changes_data(gdat['dec'])
            data['dec'] = gdat['dec']
            data['chart'] = gdat['chart']
            data['status'] = True
        else:
            data = {'status':False}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        if request.POST:
            b = request.POST['b']
            e = request.POST['e']
            p = request.POST['p']
            data = {}
            data['summary'] = self.process_summary(request,b,e,p)
            gdat = self.process_graph(request,b,e,p)
            prepare_changes_data(gdat['inc'])
            data['inc'] = gdat['inc']
            prepare_changes_data(gdat['dec'])
            data['dec'] = gdat['dec']
            data['chart'] = gdat['chart']
            data['status'] = True
        else:
            data = {'status':False}
        return JsonResponse(data)

    def process_summary(self,request,b,e,p):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        if p=='all':
            inc = InventoryIncrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            dec = InventoryDecrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            end = Product.objects.filter().aggregate(total=Sum('quantity'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = InventoryIncrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
                today_end_dec = InventoryDecrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}
        else:
            inc = InventoryIncrement.objects.filter(timestamp__range=(b,e),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            dec = InventoryDecrement.objects.filter(timestamp__range=(b,e),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            end = Product.objects.filter(pk=p).aggregate(total=Sum('quantity'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = InventoryIncrement.objects.filter(timestamp__range=(e,today),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
                today_end_dec = InventoryDecrement.objects.filter(timestamp__range=(e,today),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}

        inc['total'] = inc['total'] if inc['total'] is not None else 0
        dec['total'] = dec['total'] if dec['total'] is not None else 0
        end['total'] = end['total'] if end['total'] is not None else 0
        today_end_inc['total'] = today_end_inc['total'] if today_end_inc['total'] is not None else 0
        today_end_dec['total'] = today_end_dec['total'] if today_end_dec['total'] is not None else 0
        end['total']=end['total']-today_end_inc['total']+today_end_dec['total']
        start = end['total'] - inc['total'] + dec['total']

        data = [
            {'id':1,'a':start,'b':'','c':'','desc':'Product on hand at the beginning of the period'},
            {'id':2,'a':inc['total'],'b':'','c':'','desc':'Add all increments in inventory'},
            {'id':3,'a':'','b':start+inc['total'],'c':'','desc':''},
            {'id':4,'a':'','b':dec['total'],'c':'','desc':'Subtract all decrements in inventory'},
            {'id':5,'a':'','b':'','c':end['total'],'desc':'Product on hand at the end of the period'},
        ]

        return data

    def process_graph(self,request,b,e,p):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        if p=='all':
            tinc = InventoryIncrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            tdec = InventoryDecrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            inc = list(InventoryIncrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            dec = list(InventoryDecrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            end = Product.objects.filter(bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = InventoryIncrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
                today_end_dec = InventoryDecrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}
        else:
            tinc = InventoryIncrement.objects.filter(timestamp__range=(b,e),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            tdec = InventoryDecrement.objects.filter(timestamp__range=(b,e),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            inc = list(InventoryIncrement.objects.filter(timestamp__range=(b,e),inventory_id=p, bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            dec = list(InventoryDecrement.objects.filter(timestamp__range=(b,e),inventory_id=p, bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            end = Product.objects.filter(pk=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = InventoryIncrement.objects.filter(timestamp__range=(e,today),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
                today_end_dec = InventoryDecrement.objects.filter(timestamp__range=(e,today),inventory_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}

        tinc['total'] = tinc['total'] if tinc['total'] is not None else 0
        tdec['total'] = tdec['total'] if tdec['total'] is not None else 0
        end['total'] = end['total'] if end['total'] is not None else 0
        today_end_inc['total'] = today_end_inc['total'] if today_end_inc['total'] is not None else 0
        today_end_dec['total'] = today_end_dec['total'] if today_end_dec['total'] is not None else 0
        end['total']=end['total']-today_end_inc['total']+today_end_dec['total']
        start = end['total'] - tinc['total'] + tdec['total']
        dinc = group_by_day(inc,'inc')
        ddec = group_by_day(dec,'dec')
        bdi = dinc
        # for dd in ddec:
        #     bdi.append(dd)
        bdi.extend(ddec)
        bdi.sort(key=sort_time)
        idb = historate_stock(start,bdi)
        data = {'inc':inc,'dec':dec,'chart':idb}
        return data
        # Get increment and decremet for each day

class InventorySummaryTracker(View):

    def get(self, request, *args, **kwargs):
        if request.GET:
            b = request.GET['b']
            e = request.GET['e']
            data = {}
            data['summary'] = self.process_summary(request,b,e)
            data['status'] = True
        else:
            data = {'status':False}
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        if request.POST:
            b = request.POST['b']
            e = request.POST['e']
            data = {}
            data['summary'] = self.process_summary(request,b,e)
            data['status'] = True
        else:
            data = {'status':False}
        return JsonResponse(data)

    def process_summary(self,request,b,e):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        prod = Product.objects.filter(bussiness=bussiness, branch=branch)
        data = []
        for pro in prod:
            inc = pro.inventoryincrement_set.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            purch = pro.inventoryincrement_set.filter(content_type__model__in=["cashpurchase","creditpurchase"],timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            pr = pro.inventorydecrement_set.filter(content_type__model__in=["cashpurchasereturn","creditpurchasereturn"],timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            sr = pro.inventoryincrement_set.filter(content_type__model__in=["cashsalesreturn","creditsalesreturn"],timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            dec = pro.inventorydecrement_set.filter(timestamp__range=(b,e)).aggregate(total=Sum('quantity'))
            sales = pro.inventorydecrement_set.filter(content_type__model__in=["cashsale","creditsale"],timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            end = pro.quantity
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = pro.inventoryincrement_set.filter(timestamp__range=(b,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
                today_end_dec = pro.inventorydecrement_set.filter(timestamp__range=(b,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}

            today_end_inc['total'] = today_end_inc['total'] if today_end_inc['total'] is not None else 0
            today_end_dec['total'] = today_end_dec['total'] if today_end_dec['total'] is not None else 0
            end=end-today_end_inc['total']+today_end_dec['total']

            inc['total'] = inc['total'] if inc['total'] is not None else 0
            dec['total'] = dec['total'] if dec['total'] is not None else 0
            purch['total'] = purch['total'] if purch['total'] is not None else 0
            pr['total'] = pr['total'] if pr['total'] is not None else 0
            sr['total'] = sr['total'] if sr['total'] is not None else 0
            sales['total'] = sales['total'] if sales['total'] is not None else 0
            initial = end - inc['total'] + dec['total']
            data.append({
                'product':pro.name,
                'init':initial,
                'inc':inc['total'],
                'purchases':purch['total'],
                'pr':pr['total'],
                'sr':sr['total'],
                'dec':dec['total'],
                'sales':sales['total'],
                'end':end
            })
        end = Product.objects.filter(bussiness=bussiness, branch=branch).aggregate(total=Sum('quantity'))
        return data
