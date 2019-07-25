from django.contrib import admin
from .models import Category,Product,InventoryIncrement,InventoryDecrement
# Register your models here.
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(InventoryIncrement)
admin.site.register(InventoryDecrement)
