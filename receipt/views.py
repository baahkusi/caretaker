from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from receipt.forms import (SalesReceiptForm,SalesReturnReceiptForm,
                             PurchaseReceiptForm,PurchaseReturnReceiptForm)
from custom.views import (JSONCreateView,JSONUpdateView,JSONQueryGet,
                            JSONQueryView,JSONDeleteView)
from receipt.models import (SalesReceipt,SalesReturnReceipt,
                                PurchaseReceipt,PurchaseReturnReceipt)
from pos.models import CashSale,CashSalesReturn
from pop.models import CashPurchase,CashPurchaseReturn
from django.core.exceptions import ObjectDoesNotExist
import datetime
from .helpers import prepare_receipt_data
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
# This view loads in the app
@method_decorator(access_required('receipt'), name='dispatch')
class AppInit(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'receipt/index.html'

# helpers

class VoidReceipt(View):

    def post(self, request, *args, **kwargs):
        rpk = request.POST['id']
        try:
            receipt = self.Receipt.objects.get(pk=rpk)
            receipt.status = '000'
            receipt.save()
            records = self.Record.objects.filter(receipt=rpk)
            for record in records:
                if not record.is_voided:
                    # if hasattr(record, 'cash_increment'):
                    #     # decrease cash
                    #     amount = record.sp * record.quantity
                    #     CashDecrement.objects.create(cash=record.cash,
                    #                     amount=amount,
                    #                     system=record.system,
                    #                     currency=record.currency,
                    #                     content_object=record,
                    #                     employee=record.employee,
                    #                     comment="Receipt Voided")
                    # elif hasattr(record, 'cash_decrement'):
                    #     # increase cash
                    #     amount = record.sp * record.quantity
                    #     CashIncrement.objects.create(cash=record.cash,
                    #                     amount=amount,
                    #                     system=record.system,
                    #                     currency=record.currency,
                    #                     content_object=record,
                    #                     employee=record.employee,
                    #                     comment="Voided")
                    # else:
                    #     raise Exception('Invalid Object', 'This record object is definitely invalid')
                    


                    record.is_voided = True
                    record.save()
            data = {'status':True,'msg':'Receipt Voided'}
        except ObjectDoesNotExist:
            data = {'status':False,'msg':"Couldn't void receipt"}
            pass

        return JsonResponse(data)

#Views for SalesReceipt model
#create view
class CreateSalesReceipt(JSONCreateView):
    form = SalesReceiptForm
    model = SalesReceipt
    object_dat = ['id','number','timestamp','currency','system','cash']
    user_required = True

    def after_create(self, *args):
        inst = args[0]
        inst.number += str(inst.id)
        inst.save()
#update view
class UpdateSalesReceipt(JSONUpdateView):
    form = SalesReceiptForm
    model = SalesReceipt
    user_required = True
#query view
class SalesReceipts(JSONQueryView):
    model = SalesReceipt
    accept_arg = True

    def make_query(self, ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_receipt_data(data,'SalesReceipt')
            return data
        else:
            data = list(self.model.objects.values().filter(timestamp__range=(start,end)).order_by('-timestamp'))
            prepare_receipt_data(data,'SalesReceipt')
        return data


#query view
class RecallSalesReceipt(JSONQueryGet):
    Qmodel = SalesReceipt
    Rmodel = CashSale
    fk = 'receipt'
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



#Views for SalesReturnReceipt model
#create view
class CreateSalesReturnReceipt(JSONCreateView):
    form = SalesReturnReceiptForm
    object_dat = ['id','number','timestamp','currency','system','cash']
    user_required = True

    def after_create(self,*args):
        inst = args[0]
        sales_receipt = args[1]['sales_receipt']
        try:
            sale = SalesReceipt.objects.get(pk=sales_receipt)
            sale.status = '600'
            sale.save()
            inst.salesreceipt = sale
            inst.number += str(inst.id)
            inst.currency = sale.currency
            inst.system = sale.system
            inst.cash = sale.cash
            inst.save()
        except ObjectDoesNotExist:
            raise
#update view
class UpdateSalesReturnReceipt(JSONUpdateView):
    form = SalesReturnReceiptForm
    model = SalesReturnReceipt
    user_required = True
#query view
class SalesReturnReceipts(JSONQueryView):
    model = SalesReturnReceipt
    accept_arg = True

    def make_query(self, ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_receipt_data(data,'SalesReturnReceipt')
            return data
        else:
            data = list(self.model.objects.values().filter(timestamp__range=(start,end)).order_by('-timestamp'))
            prepare_receipt_data(data,'SalesReturnReceipt')
        return data

#query view
class RecallSalesReturnReceipt(JSONQueryGet):
    Qmodel = SalesReturnReceipt
    Rmodel = CashSalesReturn
    fk = 'receipt'
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
# Views for PurchaseReceipt model
#create PurchaseReceipt
class CreatePurchaseReceipt(JSONCreateView):
    form = PurchaseReceiptForm
    model = PurchaseReceipt
    object_dat = ['id','number','timestamp','currency','system','cash']
    user_required = True

    def after_create(self, *args):
        inst = args[0]
        inst.number += str(inst.id)
        inst.save()
#update view
class UpdatePurchaseReceipt(JSONUpdateView):
    form = PurchaseReceiptForm
    model = PurchaseReceipt
    user_required = True
#query PurchaseReceipt
class PurchaseReceipts(JSONQueryView):
    model = PurchaseReceipt
    accept_arg = True

    def make_query(self, ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_receipt_data(data,'PurchaseReceipt')
            return data
        else:
            data = list(self.model.objects.values().filter(timestamp__range=(start,end)).order_by('-timestamp'))
            prepare_receipt_data(data,'PurchaseReceipt')
        return data
#query view
class RecallPurchaseReceipt(JSONQueryGet):
    Qmodel = PurchaseReceipt
    Rmodel = CashPurchase
    fk = 'receipt'
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
#Views for PurchaseReturnReceipt model
#create view
class CreatePurchaseReturnReceipt(JSONCreateView):
    form = PurchaseReturnReceiptForm
    model = PurchaseReturnReceipt
    object_dat = ['id','number','timestamp','currency','system','cash']
    user_required = True

    def after_create(self,*args):
        inst = args[0]
        purchases_receipt = args[1]['purchases_receipt']
        try:
            purchase = PurchaseReceipt.objects.get(pk=purchases_receipt)
            purchase.status = '600'
            purchase.save()
            inst.purchasesreceipt = purchase
            inst.number += str(inst.id)
            inst.currency = purchase.currency
            inst.system = purchase.system
            inst.cash = purchase.cash
            inst.save()
        except ObjectDoesNotExist:
            raise
#update view
class UpdatePurchaseReturnReceipt(JSONUpdateView):
    form = PurchaseReturnReceiptForm
    model = PurchaseReturnReceipt
    user_required = True
#query view
class PurchaseReturnReceipts(JSONQueryView):
    model = PurchaseReturnReceipt
    accept_arg = True

    def make_query(self, ask):
        start =  ask.get('start')
        end = ask.get('end')
        if start is None or end is None:
            data = list(self.model.objects.filter(**ask).values().order_by('-timestamp'))
            prepare_receipt_data(data,'PurchaseReturnReceipt')
            return data
        else:
           
            data = list(self.model.objects.values().filter(timestamp__range=(start,end)).order_by('-timestamp'))
            prepare_receipt_data(data,'PurchaseReturnReceipt')
        return data

class RecallPurchaseReturnReceipt(JSONQueryGet):
    Qmodel = PurchaseReturnReceipt
    Rmodel = CashPurchaseReturn
    fk = 'receipt'
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
# Void Receipts
class VoidPurchaseReceipt(VoidReceipt):
    Receipt = PurchaseReceipt
    Record = CashPurchase

class VoidPurchaseReturnReceipt(VoidReceipt):
    Receipt = PurchaseReturnReceipt
    Record = CashPurchaseReturn

class VoidSalesReceipt(VoidReceipt):
    Receipt = SalesReceipt
    Record = CashSale

class VoidSalesReturnReceipt(VoidReceipt):
    Receipt = SalesReturnReceipt
    Record = CashSalesReturn
