from rest_framework import serializers

from .models import Coordinates
from django.contrib.auth.models import User

class CoordinateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coordinates
        fields = '__all__'

    def save(self, user_id=None):
        coordinates = Coordinates(
            city=self.validated_data['city'],
            user= User.objects.get(id=user_id),
        )
        coordinates.save()
        return coordinates
    
    def update(self, id=None):
        coordinates = Coordinates.objects.get(id=id)
        coordinates.city = self.validated_data['city']
        coordinates.save()
        return coordinates


        