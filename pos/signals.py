from django.db.models.signals import post_save
from django.dispatch import receiver
from inventory.models import InventoryIncrement,InventoryDecrement,Product
from pos.models import CreditSale,CashSale,CreditSalesReturn,CashSalesReturn
from cash.models import CashDecrement,CashIncrement
from django.forms.models import model_to_dict

@receiver(post_save, sender=CreditSale)
@receiver(post_save, sender=CashSale)
def decrease_inventory_s(sender , instance , created , **kwargs):
    if created:
        InventoryDecrement.objects.create(product=instance.product,
                                        product_name=instance.product_name,
                                        cp=instance.cp,
                                        sp=instance.sp,
                                        quantity=instance.quantity,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Sales")
        if isinstance(instance,CashSale):
            # am = model_to_dict(instance)
            # raise Exception("Break")
            amount = instance.sp * instance.quantity
            CashIncrement.objects.create(cash=instance.cash,
                                        amount=amount,
                                        system=instance.system,
                                        currency=instance.currency,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Cash Sales")
    else:
        dec = instance.inventory_decrement.all()[0]
        dec.tempq = dec.quantity
        dec.quantity = instance.quantity
        dec.save()
        if isinstance(instance,CashSale):
            cash_inc = instance.cash_increment.all()[0]
            cash_inc.tempa = cash_inc.amount
            cash_inc.amount = instance.sp*instance.quantity
            cash_inc.save()

@receiver(post_save, sender=CreditSalesReturn)
@receiver(post_save, sender=CashSalesReturn)
def increase_inventory_sr(sender, instance, created, **kwargs):
    if created:
        InventoryIncrement.objects.create(product=instance.product,
                                        product_name=instance.product_name,
                                        cp=instance.cp,
                                        sp=instance.sp,
                                        quantity=instance.quantity,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Sales Returns")
        if isinstance(instance,CashSalesReturn):
            amount = instance.sp * instance.quantity
            CashDecrement.objects.create(cash=instance.cash,
                                        amount=amount,
                                        system=instance.system,
                                        currency=instance.currency,
                                        content_object=instance,
                                        employee=instance.employee,
                                        comment="Cash Sales Returns")
    else:
        inc = instance.inventory_increment.all()[0]
        inc.tempq = inc.quantity
        inc.quantity = instance.quantity
        inc.save()
        if isinstance(instance,CashSalesReturn):
            cash_dec = instance.cash_decrement.all()[0]
            cash_dec.tempa = cash_dec.amount
            cash_dec.amount = instance.sp * instance.quantity
            cash_dec.save()
