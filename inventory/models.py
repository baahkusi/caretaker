from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
 
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=50,unique=True)
    
    # code = models.CharField(max_length=10,unique=True)
    desc = models.CharField(max_length=256,null=True,blank=True)

class Product(models.Model):
    name = models.CharField(max_length=50,unique=True)
    cp = models.DecimalField(max_digits=10, decimal_places=3)
    sp = models.DecimalField(max_digits=10, decimal_places=3)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)
    # code = models.CharField(max_length=10,unique=True,blank=True)
    # barcode = models.CharField(max_length=20,blank=True,unique=True)
    # upc = models.CharField(max_length=20,blank=True,unique=True)
    # desc = models.CharField(max_length=256,blank=True)
    min_stock = models.PositiveIntegerField(blank=True,default=1)
    max_stock = models.PositiveIntegerField(blank=True,default=100)
    # weight = models.PositiveSmallIntegerField(blank=True)
    unit_of_measure = models.CharField(max_length=8,blank=True)
    

class Change(models.Model):
    product = models.ForeignKey(Product,on_delete=models.SET_NULL,null=True)
    product_name = models.CharField(max_length=50,null=True)
    cp = models.DecimalField(max_digits=10, decimal_places=3)
    sp = models.DecimalField(max_digits=10, decimal_places=3)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tempq = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, blank=True)
    employee = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    content_type = models.ForeignKey(ContentType,on_delete=models.CASCADE,blank=True,null=True)
    # cause of change purchases|sales|purchasesreturns|salesreturns
    object_id = models.PositiveIntegerField(blank=True,null=True)
    content_object = GenericForeignKey()
    # date = models.DateField(blank=True,null=True)
    # time = models.TimeField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)

    class Meta:
        abstract = True

class InventoryIncrement(Change):
    comment = models.CharField(max_length=256, default="Increase")

class InventoryDecrement(Change):
    comment = models.CharField(max_length=256, default="Decrease")
