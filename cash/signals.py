from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from cash.models import CashIncrement,CashDecrement
from django.forms.models import model_to_dict

@receiver(post_save, sender=CashIncrement)
def incrememt_cash_bal(sender, instance, created, **kwargs):
    if created:
        # ca = model_to_dict(instance)
        cash = instance.cash
        cash.balance = F('balance') + instance.amount
        cash.save()
    else:
        diff = instance.amount - instance.tempa
        if diff == 0:
            pass
        else:
            cash = instance.cash
            cash.balance = F('balance') + diff
            cash.save()

@receiver(post_save, sender=CashDecrement)
def decrememt_cash_bal(sender, instance, created, **kwargs):
    if created:
        cash = instance.cash
        cash.balance = F('balance') - instance.amount
        cash.save()
    else:
        diff = instance.amount - instance.tempa
        if diff == 0:
            pass
        else:
            cash = instance.cash
            cash.balance = F('balance') - diff
            cash.save()
