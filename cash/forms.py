from django.forms import ModelForm
from cash.models import Cash,CashIncrement,CashDecrement

class CashForm(ModelForm):
    class Meta:
        model = Cash
        exclude = ['balance']

class CashIncrementForm(ModelForm):
    class Meta:
        model = CashIncrement
        fields = '__all__'

class CashDecrementForm(ModelForm):
    class Meta:
        model = CashDecrement
        fields = '__all__'
