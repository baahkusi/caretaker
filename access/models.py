from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Access(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    access = models.CharField(max_length=256,default="")
    