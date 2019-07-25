from django.contrib import admin
from invoice.models import (SalesInvoice,SalesReturnInvoice,
                    PurchaseInvoice,PurchaseReturnInvoice)

admin.site.register(SalesInvoice)
admin.site.register(SalesReturnInvoice)
admin.site.register(PurchaseInvoice)
admin.site.register(PurchaseReturnInvoice)
