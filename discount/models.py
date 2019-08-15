from django.db import models
 
# Create your models here.

class Discount(models.Model):
    desc = models.CharField(max_length=256)
    amount = models.PositiveSmallIntegerField()
    is_general = models.BooleanField(default=False)
    