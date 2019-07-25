from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
import datetime

def prepare_changes_data(changes):
    for change in changes:
        stamp = change['timestamp']
        change['day'] = str(stamp.date())
        change['time'] = str(stamp.time()).split('.')[0]
        try:
            change['employee_id'] = User.objects.get(pk=change['employee_id']).username
        except ObjectDoesNotExist:
            change['employee_id'] = "None"
    return changes
