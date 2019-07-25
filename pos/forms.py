from django.forms import ModelForm
from pos.models import CreditSale,CashSale,CreditSalesReturn,CashSalesReturn

class CreditSaleForm(ModelForm):
    class Meta:
        model = CreditSale
        fields = '__all__'

class CashSaleForm(ModelForm):
    class Meta:
        model = CashSale
        fields = '__all__'

class CreditSalesReturnForm(ModelForm):
    class Meta:
        model = CreditSalesReturn
        fields = '__all__'

class CashSalesReturnForm(ModelForm):
    class Meta:
        model = CashSalesReturn
        fields = '__all__'
