from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from invoice.forms import (SalesInvoiceForm,SalesReturnInvoiceForm,
                             PurchaseInvoiceForm,PurchaseReturnInvoiceForm)
from custom.views import (JSONCreateView,JSONUpdateView,JSONQueryGet,
                            JSONQueryView,JSONDeleteView)
from invoice.models import (SalesInvoice,SalesReturnInvoice,
                                PurchaseInvoice,PurchaseReturnInvoice)
from pos.models import CreditSale,CreditSalesReturn
from pop.models import CreditPurchase,CreditPurchaseReturn
from django.core.exceptions import ObjectDoesNotExist
import datetime
from invoice.helpers import prepare_invoice_data
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
from cash.models import CashIncrement,CashDecrement,Cash
from decimal import Decimal
# This view loads in the app
@method_decorator(access_required('invoice'), name='dispatch')
class AppInit(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'invoice/index.html'

# helpers

class VoidInvoice(View):

    def post(self, request, *args, **kwargs):
        rpk = request.POST['id']
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        try:
            invoice = self.Invoice.objects.get(pk=rpk, bussiness=bussiness, branch=branch)
            invoice.status = '000'
            invoice.save()
            records = self.Record.objects.filter(invoice=rpk, bussiness=bussiness, branch=branch)
            for record in records:
                if not record.is_voided:
                    record.is_voided = True
                    record.save()
            data = {'status':True,'msg':'Invoice Voided'}
        except ObjectDoesNotExist:
            data = {'status':False,'msg':"Couldn't void invoice"}

        return JsonResponse(data)

class PayInvoice(View):

    def post(self, request, *args, **kwargs):
        bussiness = request.session['BB']['BUSSINESS']
        branch = request.session['BB']['BRANCH']
        if request.POST:
            cash = int(request.POST.get('payment_method'))
            cash_value = request.POST.get('payment_value')
            cash_intent = request.POST.get('cash_intent')
            cash = Cash.objects.get(pk=cash)
            pay =  float(request.POST.get('pay'))
            if cash.balance < Decimal(pay) and cash_intent == 'dec':
                data = {'status':False,'msg':'There is not enough funds in '+cash_value+' to pay'}
            else:
                system =  request.POST.get('system')
                currency =  request.POST.get('currency')
                amount =  float(request.POST.get('amount'))
                settled =  float(request.POST.get('settled'))
                if pay+settled > amount:
                    data = {'status':False,'msg':'Overpaying is not allowed'}
                else:
                    try:
                        invoice = request.POST.get('id')
                        instance = self.invoice.objects.get(pk=invoice, bussiness=bussiness, branch=branch)
                        instance.status = "007" if pay+settled >= amount else "212"
                        instance.settled += Decimal(pay)
                        instance.save()

                        self.cash.objects.create(cash=cash,
                                                    amount=pay,
                                                    system=system,
                                                    currency=currency,
                                                    employee=request.user,
                                                    content_object=instance,
                                                    comment="Payment")
                        data = {'status':True,'msg':'Payment Made'}
                    except ObjectDoesNotExist:
                        data = {'status':False,'msg':'Empty Request'}
                    
        else:
            data = {'status':False,'msg':'Empty Request'}

        return JsonResponse(data)


class PaySalesInvoice(PayInvoice):
    cash = CashIncrement
    invoice = SalesInvoice

class PayPurchaseInvoice(PayInvoice):
    cash = CashDecrement
    invoice = PurchaseInvoice
#Views for SalesInvoice model
#create view
class CreateSalesInvoice(JSONCreateView):
    form = SalesInvoiceForm
    model = SalesInvoice
    object_dat = ['id','number','timestamp']
    user_required = True

    def after_create(self, *args):
        inst = args[0]
        inst.number += str(inst.id)
        inst.save()
#update view
class UpdateSalesInvoice(JSONUpdateView):
    form = SalesInvoiceForm
    model = SalesInvoice
    user_required = True
#query view
class SalesInvoices(JSONQueryView):
    model = SalesInvoice
    accept_arg = True

    def make_query(self,ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_invoice_data(data,'SalesInvoice')
            return data
        else:
            bussiness = ask['bussiness']
            branch = ask['branch']
            data = list(self.model.objects.values().filter(timestamp__range=(start,end), bussiness=bussiness, branch=branch).order_by('-timestamp'))
            prepare_invoice_data(data,'SalesInvoice')
        return data
#query view
class RecallSalesInvoice(JSONQueryGet):
    Qmodel = SalesInvoice
    Rmodel = CreditSale
    fk = 'invoice'
    attr = 'number'
    extra_values = {'quantity':'old_quantity'}

    def prepare_data(self,data):
        data = super().prepare_data(data)
        if data['status']:
            if data['q_objects']['status'] == '007':
                data['code'] = '007'
            elif data['q_objects']['status'] == '600':
                data['status'] = False
                data['code'] = '600'
            elif data['q_objects']['status'] == '000':
                data['status'] = False
                data['code'] = '000'
        return data

    def proc_f(self,*args):
        obj = args[1]
        obj['date'] = obj['timestamp'].date()
        obj['time'] = str(obj['timestamp'].time()).split('.')[0]


#Views for SalesReturnInvoice model
#create view
class CreateSalesReturnInvoice(JSONCreateView):
    form = SalesReturnInvoiceForm
    object_dat = ['id','number','timestamp']
    user_required = True

    def after_create(self,*args):
        inst = args[0]
        sales_invoice = args[1]['sales_invoice']
        try:
            sale = SalesInvoice.objects.get(pk=sales_invoice)
            sale.status = '600'
            sale.save()
            inst.salesinvoice = sale
            inst.number += str(inst.id)
            inst.save()
        except ObjectDoesNotExist:
            raise
#update view
class UpdateSalesReturnInvoice(JSONUpdateView):
    form = SalesReturnInvoiceForm
    model = SalesReturnInvoice
    user_required = True
#query view
class SalesReturnInvoices(JSONQueryView):
    model = SalesReturnInvoice
    accept_arg = True

    def make_query(self,ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_invoice_data(data,'SalesReturnInvoice')
            return data
        else:
            bussiness = ask['bussiness']
            branch = ask['branch']
            data = list(self.model.objects.values().filter(timestamp__range=(start,end), bussiness=bussiness, branch=branch).order_by('-timestamp'))
            prepare_invoice_data(data,'SalesReturnInvoice')
        return data

class RecallSalesReturnInvoice(JSONQueryGet):
    Qmodel = SalesReturnInvoice
    Rmodel = CreditSalesReturn
    fk = 'invoice'
    attr = 'number'
    extra_values = {'quantity':'old_quantity'}

    def prepare_data(self,data):
        data = super().prepare_data(data)
        if data['status']:
            if data['q_objects']['status'] == '007':
                data['code'] = '007'
            elif data['q_objects']['status'] == '600':
                data['status'] = False
                data['code'] = '600'
            elif data['q_objects']['status'] == '000':
                data['status'] = False
                data['code'] = '000'
        return data

    def proc_f(self,*args):
        obj = args[1]
        obj['date'] = obj['timestamp'].date()
        obj['time'] = str(obj['timestamp'].time()).split('.')[0]

# Views for PurchaseInvoice model
#create PurchaseInvoice
class CreatePurchaseInvoice(JSONCreateView):
    form = PurchaseInvoiceForm
    model = PurchaseInvoice
    object_dat = ['id','number','timestamp']
    user_required = True

    def after_create(self, *args):
        inst = args[0]
        inst.number += str(inst.id)
        inst.save()
#update view
class UpdatePurchaseInvoice(JSONUpdateView):
    form = PurchaseInvoiceForm
    model = PurchaseInvoice
    user_required = True
#query PurchaseInvoice
class PurchaseInvoices(JSONQueryView):
    model = PurchaseInvoice
    accept_arg = True

    def make_query(self,ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_invoice_data(data,'PurchaseInvoice')
            return data
        else:
            bussiness = ask['bussiness']
            branch = ask['branch']
            data = list(self.model.objects.values().filter(timestamp__range=(start,end), bussiness=bussiness, branch=branch).order_by('-timestamp'))
            prepare_invoice_data(data,'PurchaseInvoice')
        return data

class RecallPurchaseInvoice(JSONQueryGet):
    Qmodel = PurchaseInvoice
    Rmodel = CreditPurchase
    fk = 'invoice'
    attr = 'number'
    extra_values = {'quantity':'old_quantity'}

    def prepare_data(self,data):
        data = super().prepare_data(data)
        if data['status']:
            if data['q_objects']['status'] == '007':
                data['code'] = '007'
            elif data['q_objects']['status'] == '600':
                data['status'] = False
                data['code'] = '600'
            elif data['q_objects']['status'] == '000':
                data['status'] = False
                data['code'] = '000'
        return data

    def proc_f(self,*args):
        obj = args[1]
        obj['date'] = obj['timestamp'].date()
        obj['time'] = str(obj['timestamp'].time()).split('.')[0]
#Views for PurchaseReturnInvoice model
#create view
class CreatePurchaseReturnInvoice(JSONCreateView):
    form = PurchaseReturnInvoiceForm
    model = PurchaseReturnInvoice
    object_dat = ['id','number','timestamp']
    user_required = True

    def after_create(self,*args):
        inst = args[0]
        purchases_invoice = args[1]['purchases_invoice']
        try:
            purchase = PurchaseInvoice.objects.get(pk=purchases_invoice)
            purchase.status = '600'
            purchase.save()
            inst.purchasesinvoice = purchase
            inst.number += str(inst.id)
            inst.save()
        except ObjectDoesNotExist:
            raise
#update view
class UpdatePurchaseReturnInvoice(JSONUpdateView):
    form = PurchaseReturnInvoiceForm
    model = PurchaseReturnInvoice
    user_required = True
#query view
class PurchaseReturnInvoices(JSONQueryView):
    model = PurchaseReturnInvoice
    accept_arg = True

    def make_query(self,ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_invoice_data(data,'PurchaseReturnInvoice')
            return data
        else:
            bussiness = ask['bussiness']
            branch = ask['branch']
            data = list(self.model.objects.values().filter(timestamp__range=(start,end), bussiness=bussiness, branch=branch).order_by('-timestamp'))
            prepare_invoice_data(data,'PurchaseReturnInvoice')
        return data

class RecallPurchaseReturnInvoice(JSONQueryGet):
    Qmodel = PurchaseReturnInvoice
    Rmodel = CreditPurchaseReturn
    fk = 'invoice'
    attr = 'number'
    extra_values = {'quantity':'old_quantity'}

    def prepare_data(self,data):
        data = super().prepare_data(data)
        if data['status']:
            if data['q_objects']['status'] == '007':
                data['code'] = '007'
            elif data['q_objects']['status'] == '600':
                data['status'] = False
                data['code'] = '600'
            elif data['q_objects']['status'] == '000':
                data['status'] = False
                data['code'] = '000'
        return data

    def proc_f(self,*args):
        obj = args[1]
        obj['date'] = obj['timestamp'].date()
        obj['time'] = str(obj['timestamp'].time()).split('.')[0]

class VoidPurchaseInvoice(VoidInvoice):
    Invoice = PurchaseInvoice
    Record = CreditPurchase

class VoidPurchaseReturnInvoice(VoidInvoice):
    Invoice = PurchaseReturnInvoice
    Record = CreditPurchaseReturn

class VoidSalesInvoice(VoidInvoice):
    Invoice = SalesInvoice
    Record = CreditSale

class VoidSalesReturnInvoice(VoidInvoice):
    Invoice = SalesReturnInvoice
    Record = CreditSalesReturn
