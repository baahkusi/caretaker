from django.shortcuts import render
from django.views import generic,View
from django.http import JsonResponse
from django.db.models import F
from pos.forms import (CreditSaleForm,CashSaleForm,
                        CreditSalesReturnForm,CashSalesReturnForm)
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONCreateMultipleView)
from pos.models import CreditSale,CashSale,CreditSalesReturn,CashSalesReturn
from custom.invoice import print_invoice
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
# This view loads in the app
@method_decorator(access_required('cashpos'), name='dispatch')
class AppInitS(generic.base.TemplateView):
    template_name="pos/cashsales.html"

@method_decorator(access_required('creditpos'), name='dispatch')
class AppInitSC(generic.base.TemplateView):
    template_name="pos/creditsales.html"

@method_decorator(access_required('cashsr'), name='dispatch')
class AppInitR(generic.base.TemplateView):
    template_name="pos/creditreturns.html"

@method_decorator(access_required('creditsr'), name='dispatch')
class AppInitRC(generic.base.TemplateView):
    template_name="pos/cashreturns.html"
# helpers
class SettleSale(View):
    pass
#Views for creditsale model
#create view
class CreateCreditSale(JSONCreateMultipleView):
    model = CreditSale
    form = CreditSaleForm
    expected_var = "sales"
    general_vars = ['customer','invoice','customer_name']
    numbers = ['invoice_number','invoice_time','customer_name']
    user_required = True

    def print_receipt(self,requestPost):
        data = super().print_receipt(requestPost)

        opts = {
            'rname':'Sales Invoice',
            'rno':data['invoice_number'],
            'customer':data['customer_name'],
            'cashier':'ME AM ME',
            'currency':'GH CEDIS',
            'rdate':data['invoice_time'],
        }
        print_invoice(data['items'], opts)
#edit view
class UpdateCreditSale(JSONUpdateView):
    model = CreditSale
    form = CreditSaleForm
    user_required = True
#query view
class CreditSales(JSONQueryView):
    model = CreditSale

class DeleteCreditSale(View):

    def post(self, request, *args, **kwargs):
        try:
            pk = request.POST.get('id')
            sl = CreditSale.objects.get(pk=pk)
            inv_dec = sl.inventory_decrement.all()[0]
            
            #delete all inventory decrements
            prod = inv_dec.product
            # add back sold inventory
            prod.quantity = F('quantity') + inv_dec.quantity
            prod.save()
            inv_dec.delete()
            
            # finally delete 
            sl.delete()

            
            data = {'status':True,'msg':'Item successfully deleted'}
        except Exception as e:
            print(e)
            data = {'status':False,'msg':'Item does not exist'}
        return JsonResponse(data)

#Views for cashsale model
#create view
class CreateCashSale(JSONCreateMultipleView):
    model = CashSale
    form = CashSaleForm
    expected_var = "sales"
    general_vars = ['customer_name','receipt','cash','system','currency']
    numbers = ['receipt_number','receipt_time','customer_name']
    user_required = True

    def print_receipt(self,requestPost):
        data = super().print_receipt(requestPost)

        opts = {
            'rname':'Sales Receipt',
            'rno':data['receipt_number'],
            'customer':data['customer_name'],
            'cashier':'ME AM ME',
            'currency':'GH CEDIS',
            'rdate':data['receipt_time'],
        }
        print_invoice(data['items'], opts)

#edit view
class UpdateCashSale(JSONUpdateView):
    model = CashSale
    form = CashSaleForm
    user_required = True

#query view
class CashSales(JSONQueryView):
    model = CashSale

#delete view
class DeleteCashSale(View):

    def post(self, request, *args, **kwargs):
        try:
            pk = request.POST.get('id')
            sl = CashSale.objects.get(pk=pk)
            
            #delete all inventory decrements
            inv_dec = sl.inventory_decrement.all()[0]
            prod = inv_dec.product
            # add back sold inventory
            prod.quantity = F('quantity') + inv_dec.quantity
            prod.save()
            inv_dec.delete()

            #delete all cash increments
            cash_inc = sl.cash_increment.all()[0]
            cash = cash_inc.cash
            # remove cash
            cash.balance = F('balance') - cash_inc.amount
            cash.save()
            cash_inc.delete()
            
            # finally delete 
            sl.delete()

            
            data = {'status':True,'msg':'Item successfully deleted'}
        except Exception as e:
            print(e)
            data = {'status':False,'msg':'Item does not exist'}
        return JsonResponse(data)

#Views for creditsalesreturn model
#create view
class CreateCreditSalesReturn(JSONCreateMultipleView):
    model = CreditSalesReturn
    form = CreditSalesReturnForm
    expected_var = "sales_returns"
    general_vars = ['invoice','customer','customer_name']
    numbers = ['invoice_number','invoice_time','customer_name']
    user_required = True

    def print_receipt(self,requestPost):
        data = super().print_receipt(requestPost)
        opts = {
            'rname':'Credit Note',
            'rno':data['invoice_number'],
            'customer':data['customer_name'],
            'cashier':'ME AM ME',
            'currency':'GH CEDIS',
            'rdate':data['invoice_time'],
        }
        print_invoice(data['items'], opts)
#edit view
class UpdateCreditSalesReturn(JSONUpdateView):
    model = CreditSalesReturn
    form = CreditSalesReturnForm
    user_required = True
#query view
class CreditSalesReturns(JSONQueryView):
    model = CreditSalesReturn

class DeleteCreditSalesReturn(View):

    def post(self, request, *args, **kwargs):
        try:
            pk = request.POST.get('id')
            sl = CreditSalesReturn.objects.get(pk=pk)
            
            #delete all inventory decrements
            inv_inc = sl.inventory_increment.all()[0]
            prod = inv_inc.product
            # remove inventory
            prod.quantity = F('quantity') - inv_inc.quantity
            prod.save()
            inv_inc.delete()
            
            # finally delete 
            sl.delete()

            
            data = {'status':True,'msg':'Item successfully deleted'}
        except Exception as e:
            print(e)
            data = {'status':False,'msg':'Item does not exist'}
        return JsonResponse(data)


#Views for cashsalesreturn model
#create view
class CreateCashSalesReturn(JSONCreateMultipleView):
    model = CashSalesReturn
    form = CashSalesReturnForm
    expected_var = "sales_returns"
    general_vars = ['receipt','cash','system','currency','customer_name']
    numbers = ['receipt_number','receipt_time','customer_name']
    user_required = True

    def print_receipt(self,requestPost):
        data = super().print_receipt(requestPost)

        opts = {
            'rname':'Cash Sales Returned',
            'rno':data['receipt_number'],
            'customer':data['customer_name'],
            'cashier':'ME AM ME',
            'currency':'GH CEDIS',
            'rdate':data['receipt_time'],
        }
        print_invoice(data['items'], opts)
#edit view
class UpdateCashSalesReturn(JSONUpdateView):
    model = CashSalesReturn
    form = CashSalesReturnForm
    user_required = True
#query view
class CashSalesReturns(JSONQueryView):
    model = CashSalesReturn

#delete view
class DeleteCashSalesReturn(View):

    def post(self, request, *args, **kwargs):
        try:
            pk = request.POST.get('id')
            sl = CashSalesReturn.objects.get(pk=pk)
            
            #delete all inventory decrements
            inv_inc = sl.inventory_increment.all()[0]
            prod = inv_inc.product
            # add back sold inventory
            prod.quantity = F('quantity') - inv_inc.quantity
            prod.save()
            inv_inc.delete()

            #delete all cash increments
            cash_dec = sl.cash_decrement.all()[0]
            cash = cash_dec.cash
            # remove cash
            cash.balance = F('balance') + cash_dec.amount
            cash.save()
            cash_dec.delete()
            
            # finally delete 
            sl.delete()

            
            data = {'status':True,'msg':'Item successfully deleted'}
        except Exception as e:
            print(e)
            data = {'status':False,'msg':'Item does not exist'}
        return JsonResponse(data)