from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator

class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    username = serializers.CharField(required=True, validators = [UniqueValidator(queryset=User.objects.all(), message="Username already exists")])
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators = [validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'confirm_password', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
           raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def save(self):
        del self.validated_data['confirm_password']
        user = User.objects.create(**self.validated_data)
        user.set_password(self.validated_data['password'])
        user.save()
        return user
    
class LoginSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def userLogin(self):
        username = self.validated_data['username']
        password = self.validated_data['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            return user
        return None