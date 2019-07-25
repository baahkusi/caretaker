from django.contrib import admin
from .models import (CreditPurchase,CashPurchase,
                    CreditPurchaseReturn,CashPurchaseReturn)
# Register your models here.
admin.site.register(CreditPurchase)
admin.site.register(CashPurchase)
admin.site.register(CreditPurchaseReturn)
admin.site.register(CashPurchaseReturn)
