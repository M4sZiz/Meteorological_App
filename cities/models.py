from django.db import models

# Create your models here.
class City(models.Model):
    region = models.FloatField()
    name_ar = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    class Meta:
        db_table = "city"
