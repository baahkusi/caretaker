from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from cash.forms import CashForm,CashIncrementForm,CashDecrementForm
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONDeleteView)
from cash.models import Cash,CashIncrement,CashDecrement
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from cash.helpers import (group_by_day,sort_time,
                            prepare_changes_data,historate_cash)
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
# from django.db.models import Sum
from pos.models import CashSale,CashSalesReturn
from pop.models import CashPurchase,CashPurchaseReturn
from django.db.models import Sum,F,FloatField
import datetime
# This view loads in the app
@method_decorator(access_required('cash'), name='dispatch')
class AppInit(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'cash/index.html'

class Systems(JSONQueryView):
    model = Cash

    def make_query(self,ask=None):
        cashs = super().make_query(ask)
        data = []
        for cash in cashs:
            data.append({'id':cash['id'],
                        'value':cash['system']+" ~ "+cash['currency'],
                        'currency':cash['currency'],
                        'system':cash['system'],
                        })
        return data
#Views for Cash model
#create view
class CreateCash(JSONCreateView):
    form = CashForm
#update view
class UpdateCash(JSONUpdateView):
    form = CashForm
    model = Cash
#delete view
class DeleteCash(JSONDeleteView):
    model = Cash
#query view
class Cashs(JSONQueryView):
    model = Cash

# Views for cashincrement model
#create cashincrement
class CreateCashIncrement(JSONCreateView):
    form = CashIncrementForm
    model = CashIncrement
    user_required = True
#query cashincrement
class CashIncrements(JSONQueryView):
    model = CashIncrement
#Views for cashdecrement model
#create cashdecrement
class CreateCashDecrement(JSONCreateView):
    form = CashDecrementForm
    model = CashDecrement
    user_required = True
#query cashdecrement
class CashDecrements(JSONQueryView):
    model = CashDecrement

class CashTracker(View):

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
            inc = CashIncrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            dec = CashDecrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            end = Cash.objects.filter(bussiness=bussiness, branch=branch).aggregate(total=Sum('balance'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = CashIncrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
                today_end_dec = CashDecrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}
        else:
            inc = CashIncrement.objects.filter(timestamp__range=(b,e),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            dec = CashDecrement.objects.filter(timestamp__range=(b,e),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            end = Cash.objects.filter(pk=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('balance'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = CashIncrement.objects.filter(timestamp__range=(e,today),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
                today_end_dec = CashDecrement.objects.filter(timestamp__range=(e,today),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
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
            {'id':1,'a':start,'b':'','c':'','desc':'Cash on hand at the beginning of the period'},
            {'id':2,'a':inc['total'],'b':'','c':'','desc':'Add all increments in cash'},
            {'id':3,'a':'','b':start+inc['total'],'c':'','desc':''},
            {'id':4,'a':'','b':dec['total'],'c':'','desc':'Subtract all decrements in cash'},
            {'id':5,'a':'','b':'','c':end['total'],'desc':'Cash on hand at the end of the period'},
        ]

        return data

    def process_graph(self,request,b,e,p):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        if p=='all':
            tinc = CashIncrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            tdec = CashDecrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            inc = list(CashIncrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            dec = list(CashDecrement.objects.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            end = Cash.objects.filter(bussiness=bussiness, branch=branch).aggregate(total=Sum('balance'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = CashIncrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
                today_end_dec = CashDecrement.objects.filter(timestamp__range=(e,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            else:
                today_end_inc = {'total':None}
                today_end_dec = {'total':None}
        else:
            tinc = CashIncrement.objects.filter(timestamp__range=(b,e),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            tdec = CashDecrement.objects.filter(timestamp__range=(b,e),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            inc = list(CashIncrement.objects.filter(timestamp__range=(b,e),cash_id=p, bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            dec = list(CashDecrement.objects.filter(timestamp__range=(b,e),cash_id=p, bussiness=bussiness, branch=branch).order_by('-timestamp').values())
            end = Cash.objects.filter(pk=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('balance'))
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = CashIncrement.objects.filter(timestamp__range=(e,today),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
                today_end_dec = CashDecrement.objects.filter(timestamp__range=(e,today),cash_id=p, bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
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
        idb = historate_cash(start,bdi)
        data = {'inc':inc,'dec':dec,'chart':idb}
        return data
        # Get increment and decremet for each day

class CashSummaryTracker(View):

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
        prod = Cash.objects.filter(bussiness=bussiness, branch=branch)
        data = []
        for pro in prod:
            inc = pro.cashincrement_set.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            purch = pro.cashdecrement_set.filter(content_type__model="cashpurchase",timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            pr = pro.cashincrement_set.filter(content_type__model="cashpurchasereturn",timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            sr = pro.cashdecrement_set.filter(content_type__model="cashsalesreturn",timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            dec = pro.cashdecrement_set.filter(timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            sales = pro.cashincrement_set.filter(content_type__model="cashsale",timestamp__range=(b,e), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
            end = pro.balance
            today = str(datetime.datetime.today().date())
            if today > e:
                today = str((datetime.datetime.today()+datetime.timedelta(days=1)).date())
                today_end_inc = pro.cashincrement_set.filter(timestamp__range=(b,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
                today_end_dec = pro.cashdecrement_set.filter(timestamp__range=(b,today), bussiness=bussiness, branch=branch).aggregate(total=Sum('amount'))
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
                'system':pro.system+" ~ "+pro.currency,
                'init':initial,
                'inc':inc['total'],
                'purchases':purch['total'],
                'pr':pr['total'],
                'sr':sr['total'],
                'dec':dec['total'],
                'sales':sales['total'],
                'end':end
            })
        end = Cash.objects.filter(bussiness=bussiness, branch=branch).aggregate(total=Sum('balance'))
        return data
