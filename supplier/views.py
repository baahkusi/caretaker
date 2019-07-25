from django.shortcuts import render
from django.views import generic,View
from supplier.forms import SupplierForm
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONDeleteView)
from supplier.models import Supplier
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
from invoice.models import PurchaseInvoice,PurchaseReturnInvoice
from invoice.helpers import prepare_invoice_data
# helpers
class SupIdFace(JSONQueryView):
    model = Supplier

    def make_query(self,ask=None):
        suppliers = super().make_query(ask)
        data = []
        for supplier in suppliers:
            data.append({'id':supplier['id'],'value':supplier['name']})
        return data

class SupPI(JSONQueryView):
    accept_arg = True

    def make_query(self,ask):
        start =  ask.get('start')
        end = ask.get('end')
        sup = ask.get('id')
        bussiness = ask['bussiness']
        branch = ask['branch']
        if not sup:
            data = {'status':False,'msg':'Customer not specified'}
        else:
            data = {'status':True}
            if start is None or end is None:
                data['purchases'] = list(PurchaseInvoice.objects.values().filter(supplier=sup, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['purchases'],'PurchaseInvoice')

                data['pr'] = list(PurchaseReturnInvoice.objects.values().filter(supplier=sup, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['pr'],'PurchaseReturnInvoice')
            else:
                data['purchases'] = list(PurchaseInvoice.objects.values().filter(timestamp__range=(start,end), supplier=sup, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['purchases'],'PurchaseInvoice')

                data['pr'] = list(PurchaseReturnInvoice.objects.values().filter(timestamp__range=(start,end), supplier=sup, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['pr'],'PurchaseReturnInvoice')
        return data

# This view loads in the app
@method_decorator(access_required('supplier'), name='dispatch')
class AppInit(generic.base.TemplateView):
    template_name = 'supplier/index.html'

#Views for Supplier model
#create view
class CreateSupplier(JSONCreateView):
    form = SupplierForm
    model = Supplier
#update view
class UpdateSupplier(JSONUpdateView):
    form = SupplierForm
    model = Supplier
#delete customer
class DeleteSupplier(JSONDeleteView):
    model = Supplier
#query view
class Suppliers(JSONQueryView):
    model = Supplier
