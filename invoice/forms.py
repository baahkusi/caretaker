from django.forms import ModelForm
from invoice.models import (SalesInvoice,SalesReturnInvoice,
                                PurchaseInvoice,PurchaseReturnInvoice)

class SalesInvoiceForm(ModelForm):
    class Meta:
        model = SalesInvoice
        fields = '__all__'

class SalesReturnInvoiceForm(ModelForm):
    class Meta:
        model = SalesReturnInvoice
        fields = '__all__'

class PurchaseInvoiceForm(ModelForm):
    class Meta:
        model = PurchaseInvoice
        fields = '__all__'

class PurchaseReturnInvoiceForm(ModelForm):
    class Meta:
        model = PurchaseReturnInvoice
        fields = '__all__'
