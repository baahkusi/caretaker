from django.forms import ModelForm
from pop.models import (CreditPurchase,CashPurchase
                        ,CreditPurchaseReturn,CashPurchaseReturn)

class CreditPurchaseForm(ModelForm):
    class Meta:
        model = CreditPurchase
        fields = '__all__'

class CashPurchaseForm(ModelForm):
    class Meta:
        model = CashPurchase
        fields = '__all__'

class CreditPurchaseReturnForm(ModelForm):
    class Meta:
        model = CreditPurchaseReturn
        fields = '__all__'

class CashPurchaseReturnForm(ModelForm):
    class Meta:
        model = CashPurchaseReturn
        fields = '__all__'
