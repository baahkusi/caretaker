from django.db import models
from osm.models import Bussiness, BussinessBranch
# Create your models here.

class Discount(models.Model):
    desc = models.CharField(max_length=256)
    amount = models.PositiveSmallIntegerField()
    is_general = models.BooleanField(default=False)
    bussiness = models.OneToOneField(Bussiness, on_delete=models.CASCADE, null=True)
    branch = models.OneToOneField(BussinessBranch, on_delete=models.CASCADE, null=True)

