from django.db import models

# Create your models here.
class Bussiness(models.Model):
    name = models.CharField(max_length=256)
    domain = models.CharField(max_length=256, db_index=True, null=True)
    subdomain = models.CharField(max_length=256, db_index=True)
    subdomain_hash = models.CharField(max_length=256, db_index=True)
    email = models.CharField(max_length=256)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)

class BussinessBranch(models.Model):
    bussiness = models.ForeignKey('Bussiness', on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    location = models.CharField(max_length=256)
    status = models.CharField(max_length=256)
    branch_hash = models.CharField(max_length=256, db_index=True)
    renewed_on = models.DateField(blank=True,null=True)
    expires_on = models.DateField(blank=True,null=True)
    timestamp = models.DateTimeField(auto_now_add=True,null=True)
    last_modified = models.DateTimeField(auto_now=True,null=True)