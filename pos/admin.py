from django.contrib import admin
from .models import CreditSale,CashSale,CreditSalesReturn,CashSalesReturn
# Register your models here.
admin.site.register(CreditSale)
admin.site.register(CashSale)
admin.site.register(CreditSalesReturn)
admin.site.register(CashSalesReturn)
