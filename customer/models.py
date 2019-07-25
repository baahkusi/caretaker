from django.db import models
from osm.models import Bussiness, BussinessBranch

class Customer(models.Model):
    CID = (
        ('INDIVIDUAL','Individual'),
        ('BUSSINESS','Bussiness'),
    )
    name = models.CharField(max_length=256,null=True)
    email = models.EmailField(blank=True)
    phone_primary = models.CharField(max_length=16,blank=True)
    phone_secondary = models.CharField(max_length=16,blank=True)
    identity = models.CharField(blank=True,max_length=16,choices=CID,null=True)
    address = models.CharField(blank=True, max_length=100)
    country = models.CharField(blank=True, max_length=100)
    region = models.CharField(blank=True, max_length=100)
    city = models.CharField(blank=True, max_length=100)
    ghpgps = models.CharField(blank=True, max_length=16)
    comment = models.TextField(blank=True)
    bussiness = models.OneToOneField(Bussiness, on_delete=models.CASCADE, null=True)
    branch = models.OneToOneField(BussinessBranch, on_delete=models.CASCADE, null=True)

