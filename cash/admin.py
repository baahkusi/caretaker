from django.contrib import admin
from cash.models import Cash,CashDecrement,CashIncrement

admin.site.register(Cash)
admin.site.register(CashDecrement)
admin.site.register(CashIncrement)
