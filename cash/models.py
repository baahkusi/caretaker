from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from customer.models import Customer
from django.contrib.auth.models import User
 

class Cash(models.Model):# cash system, bank, imprest, card, online wallet
    system = models.CharField(max_length=256,default="Physical Cash")
    currency = models.CharField(max_length=64,default="GHC",blank=True)
    balance = models.DecimalField(max_digits=20,decimal_places=5,default=0,blank=True)
    comment = models.CharField(max_length=256,default="")
    

class Change(models.Model):
    cash = models.ForeignKey(Cash,on_delete=models.SET_NULL,null=True)
    system = models.CharField(max_length=256,default="Physical Cash")
    currency = models.CharField(max_length=64,default="GHC")
    amount = models.DecimalField(max_digits=10, decimal_places=3)
    tempa = models.DecimalField(max_digits=10, decimal_places=3,null=True,blank=True)
    comment = models.CharField(max_length=256,default="",blank=True)
    employee = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    content_type = models.ForeignKey(ContentType,               on_delete=models.CASCADE,blank=True,null=True)
    # cause of change purchases|sales|purchasesreturns|salesreturns
    object_id = models.PositiveIntegerField(blank=True,null=True)
    content_object = GenericForeignKey()
    date = models.DateField(blank=True,null=True)
    time = models.TimeField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)
    
    class Meta:
        abstract = True

class CashIncrement(Change):
    pass

class CashDecrement(Change):
    pass
