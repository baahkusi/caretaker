from django.db import models
from supplier.models import Supplier
from django.contrib.auth.models import User
from inventory.models import Product
from django.contrib.contenttypes.fields import GenericRelation
from inventory.models import InventoryIncrement,InventoryDecrement
from invoice.models import PurchaseInvoice,PurchaseReturnInvoice
from receipt.models import PurchaseReceipt,PurchaseReturnReceipt
from cash.models import CashIncrement,CashDecrement,Cash
 
# Create your models here.

class Purchase(models.Model):
    supplier = models.ForeignKey(Supplier,on_delete=models.SET_NULL,null=True,blank=True)
    supplier_name = models.CharField(max_length=256,default="",blank=True)
    employee = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    product_name = models.CharField(max_length=50,null=True)
    quantity= models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cp = models.DecimalField(max_digits=10, decimal_places=3)
    sp = models.DecimalField(max_digits=10, decimal_places=3)
    comment = models.CharField(max_length=256,default="",blank=True)
    is_voided = models.BooleanField(blank=True,default=False)
    date = models.DateField(blank=True,null=True)
    time = models.TimeField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        abstract = True

class CreditPurchase(Purchase):
    invoice = models.ForeignKey(PurchaseInvoice,on_delete=models.SET_NULL,null=True)
    inventory_increment = GenericRelation(InventoryIncrement)

class CashPurchase(Purchase):
    receipt = models.ForeignKey(PurchaseReceipt,on_delete=models.SET_NULL,null=True,blank=True)
    inventory_increment = GenericRelation(InventoryIncrement)
    cash_decrement = GenericRelation(CashDecrement)
    cash = models.ForeignKey(Cash,on_delete=models.SET_NULL,null=True,blank=True)
    system = models.CharField(max_length=256,default="Physical Cash",blank=True)
    currency = models.CharField(max_length=64,default="GHC",blank=True)

class CreditPurchaseReturn(Purchase):
    invoice = models.ForeignKey(PurchaseReturnInvoice,on_delete=models.SET_NULL,null=True)
    inventory_decrement = GenericRelation(InventoryDecrement)

class CashPurchaseReturn(Purchase):
    receipt = models.ForeignKey(PurchaseReturnReceipt,on_delete=models.SET_NULL,null=True)
    inventory_decrement = GenericRelation(InventoryDecrement)
    cash_increment = GenericRelation(CashIncrement)
    cash = models.ForeignKey(Cash,on_delete=models.SET_NULL,null=True,blank=True)
    system = models.CharField(max_length=256,default="Physical Cash",blank=True)
    currency = models.CharField(max_length=64,default="GHC",blank=True)
