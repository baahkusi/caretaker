from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from inventory.models import Product
import datetime
def prepare_changes_data(changes):
    for change in changes:
        stamp = change['timestamp']
        change['day'] = str(stamp.date())
        change['time'] = str(stamp.time()).split('.')[0]
        try:
            change['product_id'] = Product.objects.get(pk=change['product_id']).name
        except ObjectDoesNotExist:
            change['product_id'] = "None"
        try:
            change['content_type_id'] = ContentType.objects.get(pk=change['content_type_id']).model
        except ObjectDoesNotExist:
            change['content_type_id'] = "None"

def sort_time(x):
    return datetime.datetime.strptime(x['timestamp'], '%Y-%m-%d')

def historate_stock(opening,changes):
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
                val['quantity'] = opening
                is_in = True
                break
        if not is_in:
            vals.append({'day':change['timestamp'],'quantity':opening})
    return vals

def group_by_day(dat,flag):
    vals = []
    for dt in dat:
        is_in = False
        for val in vals:
            if val['timestamp'] == str(dt['timestamp']).split(' ')[0]:
                val['dtot'] += float(dt['quantity'])
                is_in = True
                break
        if not is_in:
            vals.append({'timestamp':str(dt['timestamp']).split(' ')[0],
            'dtot':float(dt['quantity']),'flag':flag})
    return vals
