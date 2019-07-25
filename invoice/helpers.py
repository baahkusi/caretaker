from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from customer.models import Customer
from supplier.models import Supplier
from django.contrib.auth.models import User
from pos.models import CreditSale,CreditSalesReturn
from pop.models import CreditPurchase,CreditPurchaseReturn
from invoice.models import (SalesInvoice,SalesReturnInvoice,
                                PurchaseInvoice,PurchaseReturnInvoice)
from django.db.models import Sum,F,FloatField
def prepare_invoice_data(data, invoice):
    for dat in data:
        stamp = dat['timestamp']
        dat['date'] = str(stamp.date())
        dat['time'] = str(stamp.time()).split('.')[0]

        if dat['status']=='007':
            dat['stati']='Paid'
        elif dat['status']=='600':
            dat['stati']='Returned'
        elif dat['status']=='000':
            dat['stati']='Voided'
        elif dat['status']=='419':
            dat['stati']='Unpaid'
        elif dat['status']=='202':
            dat['stati']='Overdue'
        elif dat['status']=='212':
            dat['stati']='Partly Paid'
        else:
            dat['stati']='Unknown'

        if  'customer_id' in dat.keys() and dat['customer_id']:
            try:
                customer = Customer.objects.get(pk=dat['customer_id'])
                dat['customer'] = customer.name
            except ObjectDoesNotExist:
                dat['customer'] = ''
        else:
            dat['customer'] = ''

        if  'supplier_id' in dat.keys() and dat['supplier_id']:
            try:
                supplier = Supplier.objects.get(pk=dat['supplier_id'])
                dat['supplier'] = supplier.name
            except ObjectDoesNotExist:
                dat['supplier'] = ''
        else:
            dat['supplier'] = ''

        if  dat['employee_id']:
            try:
                employee = User.objects.get(pk=dat['employee_id'])
                dat['employee'] = employee.username
            except ObjectDoesNotExist:
                dat['employee'] = ''
        else:
            dat['employee'] = ''

        if invoice == 'SalesInvoice':
            amount = CreditSale.objects.filter(invoice=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            r_attr = SalesInvoice.objects.get(pk=dat['id'])
            if hasattr(r_attr,'salesreturninvoice'):
                try:
                    r_num = SalesReturnInvoice.objects.get(salesinvoice=dat['id'])
                    dat['number'] += " / " + r_num.number
                except ObjectDoesNotExist:
                    pass
        elif invoice == 'SalesReturnInvoice':
            amount = CreditSalesReturn.objects.filter(invoice=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            try:
                r_num = SalesReturnInvoice.objects.get(salesinvoice=dat['salesinvoice_id'])
                dat['number'] += " / " + r_num.salesinvoice.number
            except ObjectDoesNotExist:
                pass
        elif invoice == 'PurchaseInvoice':
            amount = CreditPurchase.objects.filter(invoice=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            r_attr = PurchaseInvoice.objects.get(pk=dat['id'])
            if hasattr(r_attr,'purchasereturninvoice'):
                try:
                    r_num = PurchaseReturnInvoice.objects.get(purchasesinvoice=dat['id'])
                    dat['number'] += " / " + r_num.number
                except ObjectDoesNotExist:
                    pass
        elif invoice == 'PurchaseReturnInvoice':
            amount = CreditPurchaseReturn.objects.filter(invoice=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            try:
                r_num = PurchaseReturnInvoice.objects.get(purchasesinvoice=dat['purchasesinvoice_id'])
                dat['number'] += " / " + r_num.purchasesinvoice.number
            except ObjectDoesNotExist:
                pass
        dat['amount'] = amount['amount']

        dat['tax'] = 0
        dat['discount'] = 0
