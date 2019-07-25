from django.forms import ModelForm
from discount.models import Discount

class DiscountForm(ModelForm):
    class Meta:
        model = Discount
        fields = '__all__'
