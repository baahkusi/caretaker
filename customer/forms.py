from django.forms import ModelForm
from customer.models import Customer

class CustomerForm(ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'
