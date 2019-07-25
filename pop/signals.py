from django.db.models.signals import post_save
from django.dispatch import receiver
from inventory.models import InventoryIncrement,InventoryDecrement,Product
from pop.models import (CreditPurchase,CashPurchase,
                        CreditPurchaseReturn,CashPurchaseReturn)
from cash.models import CashDecrement,CashIncrement

@receiver(post_save, sender=CreditPurchase)
@receiver(post_save, sender=CashPurchase)
def increase_inventory_p(sender , instance , created , **kwargs):
    if created:
        InventoryIncrement.objects.create(product=instance.product,
                                        product_name=instance.product_name,
                                        cp=instance.cp,
                                        sp=instance.sp,
                                        quantity=instance.quantity,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment=instance.comment)
        if isinstance(instance,CashPurchase):
            amount = instance.cp * instance.quantity
            CashDecrement.objects.create(cash=instance.cash,
                                        amount=amount,
                                        system=instance.system,
                                        currency=instance.currency,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Cash Purchases")
    else:
        inventory_inc = instance.inventory_increment.all()[0]
        inventory_inc.tempq = inventory_inc.quantity
        inventory_inc.quantity = instance.quantity
        inventory_inc.save()
        if isinstance(instance,CashPurchase):
            cash_dec = instance.cash_decrement.all()[0]
            cash_dec.tempa = cash_dec.amount
            cash_dec.amount = instance.cp*instance.quantity
            cash_dec.save()

@receiver(post_save, sender=CreditPurchaseReturn)
@receiver(post_save, sender=CashPurchaseReturn)
def decrease_inventory_pr(sender, instance, created, **kwargs):
    if created:
        InventoryDecrement.objects.create(product=instance.product,
                                        product_name=instance.product_name,
                                        cp=instance.cp,
                                        sp=instance.sp,
                                        quantity=instance.quantity,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Purchases Returns")
        if isinstance(instance,CashPurchaseReturn):
            amount = instance.cp * instance.quantity
            CashIncrement.objects.create(cash=instance.cash,
                                        amount=amount,
                                        system=instance.system,
                                        currency=instance.currency,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Cash Purchases Returns")
    else:
        inventory_dec = instance.inventory_decrement.all()[0]
        inventory_dec.tempq = inventory_dec.quantity
        inventory_dec.quantity = instance.quantity
        inventory_dec.save()
        if isinstance(instance,CashPurchaseReturn):
            cash_inc = instance.cash_increment.all()[0]
            cash_inc.tempa = cash_inc.amount
            cash_inc.amount = instance.cp*instance.quantity
            cash_inc.save()
