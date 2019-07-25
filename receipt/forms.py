from django.forms import ModelForm
from receipt.models import (SalesReceipt,SalesReturnReceipt,
                                PurchaseReceipt,PurchaseReturnReceipt)

class SalesReceiptForm(ModelForm):
    class Meta:
        model = SalesReceipt
        fields = '__all__'

class SalesReturnReceiptForm(ModelForm):
    class Meta:
        model = SalesReturnReceipt
        fields = '__all__'

class PurchaseReceiptForm(ModelForm):
    class Meta:
        model = PurchaseReceipt
        fields = '__all__'

class PurchaseReturnReceiptForm(ModelForm):
    class Meta:
        model = PurchaseReturnReceipt
        fields = '__all__'
