import os
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from rest_framework.permissions import IsAuthenticated

from cities.models import City

from .handelApi import getWeatherData
# Create your views here.
class weatherView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTStatelessUserAuthentication]
    def get(self, request):

        timezone = os.getenv('API_WEATHER_TIMEZONE')
        date = f'todayT00:00:00{timezone}P1D:PT1H'
        param = 't_2m:C,precip_1h:mm,wind_speed_10m:ms,wind_dir_10m:d,weather_symbol_1h:idx'

        cityId = request.GET.get('cityId')
        if cityId:
            city = City.objects.get(id=cityId)
            lat = city.latitude
            lon = city.longitude
            coordinate = str(lat)+','+str(lon)
            
                
            weatherData = getWeatherData(date,param,coordinate)

            if weatherData == None:
                return Response({'error':'Weather API error'}, status=400)
            
            param = 't_2m:C,precip_1h:mm,wind_speed_10m:ms,weather_symbol_1h:idx'
            cityWeather = getWeatherData('now',param,coordinate)
            if cityWeather == None:
                return Response({'error':'Weather API error'}, status=400)
            
            newData = {}

            newData['city'] = {
                'name': str(city.name_en),
                'weather': cityWeather
            }
            newData['weather'] = weatherData
            
            return Response(newData)
        else:
            return Response({'error':'cityId is required'}, status=400)
    
    