from django.db import models
from customer.models import Customer
from supplier.models import Supplier
from django.contrib.auth.models import User
from discount.models import Discount
from tax.models import Tax
from cash.models import Cash
 

class Receipt(models.Model):
    STATUS = (
        ('007','Completed'),
        ('600','Returned'),
        ('000','Voided'),
    )
    number = models.CharField(max_length=256)
    employee = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    discount =  models.ManyToManyField(Discount,blank=True)
    status = models.CharField(max_length=32,choices=STATUS,default='007',blank=True)
    tax = models.ManyToManyField(Tax,blank=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)
    cash = models.ForeignKey(Cash,on_delete=models.SET_NULL,null=True,blank=True)
    system = models.CharField(max_length=256,default="Physical Cash",blank=True)
    currency = models.CharField(max_length=64,default="GHC",blank=True)
    
    class Meta:
        abstract = True

class SalesReceipt(Receipt):
    customer_name = models.CharField(max_length=256,default="",blank=True)

class SalesReturnReceipt(Receipt):
    customer_name = models.CharField(max_length=256,default="",blank=True)
    salesreceipt = models.OneToOneField(SalesReceipt,on_delete=models.SET_NULL,null=True,blank=True)

class PurchaseReceipt(Receipt):
    supplier = models.ForeignKey(Supplier,on_delete=models.SET_NULL,null=True,blank=True)
    supplier_name = models.CharField(max_length=256,default="",blank=True)

class PurchaseReturnReceipt(Receipt):
    supplier = models.ForeignKey(Supplier,on_delete=models.SET_NULL,null=True,blank=True)
    supplier_name = models.CharField(max_length=256,default="",blank=True)
    purchasesreceipt = models.OneToOneField(PurchaseReceipt,on_delete=models.SET_NULL,null=True,blank=True)
