from django.db import models
from customer.models import Customer
from supplier.models import Supplier
from django.contrib.auth.models import User
 

class Invoice(models.Model):
    STATUS = (
        ('007','Paid'),
        ('419','Unpaid'),
        ('600','Returned'),
        ('202','Overdue'),
        ('212','Partly Paid'),
        ('000','Voided'),
    )
    number = models.CharField(max_length=256)
    employee = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    status = models.CharField(max_length=32,choices=STATUS,default='419',blank=True)
    settled = models.DecimalField(max_digits=20, decimal_places=3,blank=True,default=0)
    terms = models.TextField(blank=True)
    due_date = models.DateField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        abstract = True

class SalesInvoice(Invoice):
    customer = models.ForeignKey(Customer,on_delete=models.SET_NULL,null=True,blank=True)
    customer_name = models.CharField(max_length=256,default="",blank=True)

class SalesReturnInvoice(Invoice):# credit note
    customer = models.ForeignKey(Customer,on_delete=models.SET_NULL,null=True,blank=True)
    customer_name = models.CharField(max_length=256,default="",blank=True)
    salesinvoice = models.OneToOneField(SalesInvoice,on_delete=models.SET_NULL,null=True,blank=True)

class PurchaseInvoice(Invoice):# debit note
    supplier = models.ForeignKey(Supplier,on_delete=models.SET_NULL,null=True,blank=True)
    supplier_name = models.CharField(max_length=256,default="",blank=True)

class PurchaseReturnInvoice(Invoice):
    supplier = models.ForeignKey(Supplier,on_delete=models.SET_NULL,null=True,blank=True)
    supplier_name = models.CharField(max_length=256,default="",blank=True)
    purchasesinvoice = models.OneToOneField(PurchaseInvoice,on_delete=models.SET_NULL,null=True,blank=True)
