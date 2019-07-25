from django.db import models
from django.contrib.auth.models import User
from osm.models import Bussiness, BussinessBranch
# Create your models here.

class Access(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    access = models.CharField(max_length=256,default="")
    bussiness = models.ForeignKey(Bussiness, on_delete=models.CASCADE, null=True)
    branch = models.ForeignKey(BussinessBranch, on_delete=models.CASCADE, null=True)
