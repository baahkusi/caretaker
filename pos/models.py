from django.db import models
from customer.models import Customer
from django.contrib.auth.models import User
from inventory.models import Product
from django.contrib.contenttypes.fields import GenericRelation
from inventory.models import InventoryIncrement,InventoryDecrement
from invoice.models import SalesInvoice,SalesReturnInvoice
from receipt.models import SalesReceipt,SalesReturnReceipt
from cash.models import CashIncrement,CashDecrement,Cash
from osm.models import Bussiness, BussinessBranch
# Create your models here.

class Sale(models.Model):
    employee = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    quantity= models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cp = models.DecimalField(max_digits=10, decimal_places=3)
    sp = models.DecimalField(max_digits=10, decimal_places=3)
    product_name = models.CharField(max_length=50,null=True)
    comment = models.CharField(max_length=256,default="",blank=True)
    bussiness = models.OneToOneField(Bussiness, on_delete=models.CASCADE, null=True)
    branch = models.OneToOneField(BussinessBranch, on_delete=models.CASCADE, null=True)
    is_voided = models.BooleanField(blank=True,default=False)
    # date = models.DateField(blank=True,null=True)
    # time = models.TimeField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        abstract = True

class CreditSale(Sale):
    customer = models.ForeignKey(Customer,on_delete=models.SET_NULL,null=True,blank=True)
    customer_name = models.CharField(max_length=256,default="",blank=True)
    invoice = models.ForeignKey(SalesInvoice,on_delete=models.SET_NULL,null=True)
    inventory_decrement = GenericRelation(InventoryDecrement)

class CashSale(Sale):
    customer_name = models.CharField(max_length=256,default="",blank=True)
    receipt = models.ForeignKey(SalesReceipt,on_delete=models.SET_NULL,null=True,blank=True)
    inventory_decrement = GenericRelation(InventoryDecrement)
    cash_increment = GenericRelation(CashIncrement)
    cash = models.ForeignKey(Cash,on_delete=models.SET_NULL,null=True,blank=True)
    system = models.CharField(max_length=256,default="Physical Cash",blank=True)
    currency = models.CharField(max_length=64,default="GHC",blank=True)

class CreditSalesReturn(Sale):
    customer = models.ForeignKey(Customer,on_delete=models.SET_NULL,null=True,blank=True)
    customer_name = models.CharField(max_length=256,default="",blank=True)
    invoice = models.ForeignKey(SalesReturnInvoice,on_delete=models.SET_NULL,null=True)
    inventory_increment = GenericRelation(InventoryIncrement)

class CashSalesReturn(Sale):
    customer_name = models.CharField(max_length=256,default="",blank=True)
    receipt = models.ForeignKey(SalesReturnReceipt,on_delete=models.SET_NULL,null=True)
    inventory_increment = GenericRelation(InventoryIncrement)
    cash_decrement = GenericRelation(CashDecrement)
    cash = models.ForeignKey(Cash,on_delete=models.SET_NULL,null=True,blank=True)
    system = models.CharField(max_length=256,default="Physical Cash",blank=True)
    currency = models.CharField(max_length=64,default="GHC",blank=True)
