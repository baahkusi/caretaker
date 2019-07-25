from django.forms import ModelForm
from tax.models import Tax

class TaxForm(ModelForm):
    class Meta:
        model = Tax
        fields = '__all__'
