from django.contrib import admin
from receipt.models import (SalesReceipt,SalesReturnReceipt,
                                PurchaseReceipt,PurchaseReturnReceipt)

admin.site.register(SalesReceipt)
admin.site.register(SalesReturnReceipt)
admin.site.register(PurchaseReceipt)
admin.site.register(PurchaseReturnReceipt)
