import datetime
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum,F,FloatField
from custom.views import JSONQueryView
from inventory.models import Product
from django.contrib.auth.models import User
from cash.models import Cash
from stats.helpers import filter_keys

class ProdRecord(JSONQueryView):
    accept_arg = True

    def make_query(self, ask=None):
        data = []
        record = Product.objects.all()
        for prod in record:
            records = self.model.objects.filter(product=prod)
            records = filter_keys(ask,records)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))
            if not records['record']:
                continue

            data.append({
                'cat':prod.name,
                'cat_id':prod.id,
                'record':records['record'],
            })
        return data

class UserRecord(JSONQueryView):
    accept_arg = True

    def make_query(self, ask=None):
        data = []
        record = User.objects.all()
        for user in record:
            records = self.model.objects.filter(employee=user)
            records = filter_keys(ask,records)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))
            if not records['record']:
                continue

            data.append({
                'cat':user.username,
                'cat_id':user.id,
                'record':records['record'],
            })
        return data

class PayRecord(JSONQueryView):
    accept_arg = True

    def make_query(self, ask=None):
        data = []
        record = Cash.objects.all()
        for cash in record:
            records = self.model.objects.filter(cash=cash)
            records = filter_keys(ask,records)
            records = records.aggregate(record=Sum(F(self.price)*F(self.quant), output_field=FloatField()))
            if not records['record']:
                continue
            data.append({
                'cat':cash.system+' ~ '+cash.currency,
                'cat_id':cash.id,
                'record':records['record'],
            })
        return data

class ProdSaleRecord(ProdRecord):
    price = 'sp'
    quant = 'quantity'

class ProdPurchaseRecord(ProdRecord):
    price = 'cp'
    quant = 'quantity'

class UserSaleRecord(UserRecord):
    price = 'sp'
    quant = 'quantity'

class UserPurchaseRecord(UserRecord):
    price = 'cp'
    quant = 'quantity'

class PaySaleRecord(PayRecord):
    price = 'sp'
    quant = 'quantity'

class PayPurchaseRecord(PayRecord):
    price = 'cp'
    quant = 'quantity'
