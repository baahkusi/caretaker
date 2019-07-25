from django.shortcuts import render
from django.views import generic,View
from customer.forms import CustomerForm
from custom.views import (JSONCreateView,JSONUpdateView,
                            JSONQueryView,JSONDeleteView)
from customer.models import Customer
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from custom.decorators import access_required
from invoice.models import SalesInvoice,SalesReturnInvoice
from invoice.helpers import prepare_invoice_data
# helpers
class CuteIdFace(JSONQueryView):
    model = Customer

    def make_query(self,ask=None):
        customers = super().make_query(ask)
        data = []
        for customer in customers:
            data.append({'id':customer['id'],'value':customer['name']})
        return data

class CuteSI(JSONQueryView):
    accept_arg = True

    def make_query(self,ask):
        start =  ask.get('start')
        end = ask.get('end')
        cute = ask.get('id')
        bussiness = ask.get('bussiness')
        branch = ask.get('branch')
        if not cute:
            data = {'status':False,'msg':'Customer not specified'}
        else:
            data = {'status':True}
            if start is None or end is None:
                data['sales'] = list(SalesInvoice.objects.values().filter(customer=cute, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['sales'],'SalesInvoice')

                data['sr'] = list(SalesReturnInvoice.objects.values().filter(customer=cute, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['sr'],'SalesReturnInvoice')
            else:
                data['sales'] = list(SalesInvoice.objects.values().filter(timestamp__range=(start,end), customer=cute, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['sales'],'SalesInvoice')

                data['sr'] = list(SalesReturnInvoice.objects.values().filter(timestamp__range=(start,end), customer=cute, bussiness=bussiness, branch=branch).order_by('-timestamp'))
                prepare_invoice_data(data['sr'],'SalesReturnInvoice')
        return data

# This view loads in the app
@method_decorator(access_required('customer'), name='dispatch')
class AppInit(LoginRequiredMixin,generic.base.TemplateView):
    template_name = 'customer/index.html'

#Views for Customer model
#create view
class CreateCustomer(JSONCreateView):
    form = CustomerForm
    model = Customer
#update view
class UpdateCustomer(JSONUpdateView):
    form = CustomerForm
    model = Customer
#delete customer
class DeleteCustomer(JSONDeleteView):
    model = Customer
#query view
class Customers(JSONQueryView):
    model = Customer
