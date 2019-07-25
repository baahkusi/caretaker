from django.forms import ModelForm
from inventory.models import (Category,Product,
                                InventoryIncrement,InventoryDecrement)

class CategoryForm(ModelForm):
    class Meta:
        model = Category
        fields = '__all__'

class ProductForm(ModelForm):
    class Meta:
        model = Product
        exclude = ['quantity']

class InventoryIncrementForm(ModelForm):
    class Meta:
        model = InventoryIncrement
        fields = '__all__'

class InventoryDecrementForm(ModelForm):
    class Meta:
        model = InventoryDecrement
        fields = '__all__'
