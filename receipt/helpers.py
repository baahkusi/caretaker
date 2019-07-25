from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from customer.models import Customer
from supplier.models import Supplier
from django.contrib.auth.models import User
from pos.models import CashSale,CashSalesReturn
from pop.models import CashPurchase,CashPurchaseReturn
from receipt.models import (SalesReceipt,SalesReturnReceipt,
                                PurchaseReceipt,PurchaseReturnReceipt)
from django.db.models import Sum,F,FloatField
def prepare_receipt_data(data, receipt):
    for dat in data:
        stamp = dat['timestamp']
        dat['date'] = str(stamp.date())
        dat['time'] = str(stamp.time()).split('.')[0]

        if dat['status']=='007':
            dat['stati']='Completed'
        elif dat['status']=='600':
            dat['stati']='Returned'
        elif dat['status']=='000':
            dat['stati']='Voided'
        else:
            dat['stati']='Unknown'

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

        if receipt == 'SalesReceipt':
            amount = CashSale.objects.filter(receipt=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            r_attr = SalesReceipt.objects.get(pk=dat['id'])
            if hasattr(r_attr,'salesreturnreceipt'):
                try:
                    r_num = SalesReturnReceipt.objects.get(salesreceipt=dat['id'])
                    dat['number'] += " / " + r_num.number
                except ObjectDoesNotExist:
                    pass
        elif receipt == 'SalesReturnReceipt':
            amount = CashSalesReturn.objects.filter(receipt=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            try:
                r_num = SalesReturnReceipt.objects.get(salesreceipt=dat['salesreceipt_id'])
                dat['number'] += " / " + r_num.salesreceipt.number
            except ObjectDoesNotExist:
                pass
        elif receipt == 'PurchaseReceipt':
            amount = CashPurchase.objects.filter(receipt=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            r_attr = PurchaseReceipt.objects.get(pk=dat['id'])
            if hasattr(r_attr,'purchasereturnreceipt'):
                try:
                    r_num = PurchaseReturnReceipt.objects.get(purchasesreceipt=dat['id'])
                    dat['number'] += " / " + r_num.number
                except ObjectDoesNotExist:
                    pass
        elif receipt == 'PurchaseReturnReceipt':
            amount = CashPurchaseReturn.objects.filter(receipt=dat['id']).aggregate(amount=Sum(F('sp')*F('quantity'), output_field=FloatField()))
            try:
                r_num = PurchaseReturnReceipt.objects.get(purchasesreceipt=dat['purchasesreceipt_id'])
                dat['number'] += " / " + r_num.purchasesreceipt.number
            except ObjectDoesNotExist:
                pass
        dat['amount'] = amount['amount']

        dat['payment'] = dat['system']+" ~ "+dat['currency']

        dat['tax'] = 0
        dat['discount'] = 0
