from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from cash.models import Cash
from django.contrib.auth.models import User
from supplier.models import Supplier
from pop.models import CashPurchase,CashPurchaseReturn
from pos.models import CashSale,CashSalesReturn
import datetime

def prepare_changes_data(changes):
    for change in changes:
        stamp = change['timestamp']
        change['day'] = str(stamp.date())
        change['time'] = str(stamp.time()).split('.')[0]
        try:
            ck = Cash.objects.get(pk=change['cash_id'])
            change['cash_id'] = ck.system+" ~ "+ck.currency
        except ObjectDoesNotExist:
            change['cash_id'] = "None"
        try:
            change['employee_id'] = User.objects.get(pk=change['employee_id']).username
        except ObjectDoesNotExist:
            change['employee_id'] = "None"
        if change['content_type_id']:
            model = ContentType.objects.get(pk=change['content_type_id']).model
            if model in ["cashpurchase"]:
                try:
                    change["supplier"] = CashPurchase.objects.get(pk=change['object_id']).supplier.name
                except:
                    change["supplier"] = "None"
            elif model in ["cashsale"]:
                try:
                    change["customer"] = CashSale.objects.get(pk=change['object_id']).customer.name
                except:
                    change["customer"] = "None"
            elif model in ["cashpurchasereturn"]:
                try:
                    change["supplier"] = CashPurchaseReturn.objects.get(pk=change['object_id']).customer.name
                except:
                    change["supplier"] = "None"
            elif model in ["cashsalesreturn"]:
                try:
                    change["customer"] = CashSalesReturn.objects.get(pk=change['object_id']).customer.name
                except:
                    change["customer"] = "None"

def group_by_day(dat,flag):
    vals = []
    for dt in dat:
        is_in = False
        for val in vals:
            if val['timestamp'] == str(dt['timestamp']).split(' ')[0]:
                val['dtot'] += float(dt['amount'])
                is_in = True
                break
        if not is_in:
            vals.append({'timestamp':str(dt['timestamp']).split(' ')[0],
            'dtot':float(dt['amount']),'flag':flag})
    return vals

def sort_time(x):
    return datetime.datetime.strptime(x['timestamp'], '%Y-%m-%d')

def historate_cash(opening,changes):
    vals = []
    opening = float(opening)
    for change in changes:
        if change['flag'] == 'inc':
            opening += change['dtot']
        else:
            opening -= change['dtot']
        is_in = False
        for val in vals:
            if val['day'] == change['timestamp']:
                val['bal'] = opening
                is_in = True
                break
        if not is_in:
            vals.append({'day':change['timestamp'],'bal':opening})
    return vals
