from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import F
from inventory.models import InventoryIncrement,InventoryDecrement

@receiver(post_save, sender=InventoryIncrement)
def incrememt_prod_qty(sender, instance, created, **kwargs):
    if created:
        prod = instance.product
        prod.quantity = F('quantity') + instance.quantity
        prod.cp = instance.cp
        prod.sp = instance.sp
        prod.save()
    else:
        diff = instance.quantity - instance.tempq
        if diff == 0:
            pass
        else:
            prod = instance.product
            prod.quantity = F('quantity') + diff
            prod.cp = instance.cp
            prod.sp = instance.sp
            prod.save()

@receiver(post_save, sender=InventoryDecrement)
def decrememt_prod_qty(sender, instance, created, **kwargs):
    if created:
        prod = instance.product
        prod.quantity = F('quantity') - instance.quantity
        prod.cp = instance.cp
        prod.sp = instance.sp
        prod.save()
    else:
        diff = instance.quantity - instance.tempq
        if diff == 0:
            pass
        else:
            prod = instance.product
            prod.quantity = F('quantity') - diff
            prod.cp = instance.cp
            prod.sp = instance.sp
            prod.save()
