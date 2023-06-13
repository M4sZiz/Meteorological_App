from django.db import models
from django.contrib.auth.models import User
from cities.models import City

# Create your models here.
class Coordinates(models.Model):
    city = models.ForeignKey(City, related_name='coordinates', on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, related_name='coordinates', on_delete=models.CASCADE, null=True)
    
    
    class Meta:
        db_table = 'coordinates'