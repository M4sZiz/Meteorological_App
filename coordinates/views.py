from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination

from weather.handelApi import getWeatherData

from .serializers import CoordinateSerializer
from .models import Coordinates
from cities.models import City

# Create your views here.
class coordinatesView(APIView):
    JWT_authenticator = JWTAuthentication()
    permission_classes = [IsAuthenticated] #IsAuthenticated
    authentication_classes = [JWTStatelessUserAuthentication]
    serializer_class = CoordinateSerializer

    def get(self, request):
        de_token = self.JWT_authenticator.authenticate(request)
        user , token = de_token

        coordinates = Coordinates.objects.filter(
            user_id=user.id
        )
        pagination = PageNumberPagination()
        pagination.page_size = 10
        page = pagination.paginate_queryset(coordinates, request)

        serializer = CoordinateSerializer(page, many=True)

        dataCities = []
        for data in serializer.data:
            city = City.objects.get(id=data['city'])
            data['city'] = {
                'id' : city.id,
                'name' : str(city.name_en),
                'latitude' : round(float(city.latitude), 4),
                'longitude' : round(float(city.longitude), 4)
            }
            dataCities.append(data)

        parameter = 't_max_2m_24h:C,t_min_2m_24h:C,weather_symbol_24h:idx'
        coordinate = ''
        for data in dataCities:

            if coordinate != '':
                coordinate += '+'
            coordinate += f'{data["city"]["latitude"]},{data["city"]["longitude"]}'

        ApiData = getWeatherData('now',parameter, coordinate)
        dataWeather = []
        for data in dataCities:
            for apiData in ApiData:
                if apiData['parameter'] == 't_max_2m_24h:C':
                    for coord in apiData['coordinates']:
                        if coord['lat'] == data['city']['latitude'] and coord['lon'] == data['city']['longitude']:
                            data['city']['max_temp'] = coord['dates'][0]['value']
                elif apiData['parameter'] == 't_min_2m_24h:C':
                    for coord in apiData['coordinates']:
                        if coord['lat'] == data['city']['latitude'] and coord['lon'] == data['city']['longitude']:
                            data['city']['min_temp'] = coord['dates'][0]['value']
                elif apiData['parameter'] == 'weather_symbol_24h:idx':
                    for coord in apiData['coordinates']:
                        if coord['lat'] == data['city']['latitude'] and coord['lon'] == data['city']['longitude']:
                            data['city']['weather_symbol'] = coord['dates'][0]['value']
            dataWeather.append(data)


        return pagination.get_paginated_response(dataWeather)
    
    def post(self, request):
        de_token = self.JWT_authenticator.authenticate(request)
        user , token = de_token

        serializer = CoordinateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user.id)
            return Response(serializer.data, status=201)
        
        return Response(serializer.error_messages,status=500)
    
    
class coordinatesDetailView(APIView):
        JWT_authenticator = JWTAuthentication()
        permission_classes = [IsAuthenticated]
        authentication_classes = [JWTStatelessUserAuthentication]
        serializer_class = CoordinateSerializer
        pagination_class = PageNumberPagination

        def get_object(self, id):
            try:
                return Coordinates.objects.get(id=id)
            except Coordinates.DoesNotExist:
                return None
        
        def get_user(self, request):
            de_token = self.JWT_authenticator.authenticate(request)
            user , token = de_token
            return user

        def get(self, request, id=None):
            coordinates = self.get_object(id)
            if coordinates is None:
                return Response(status=404, data="Not Found")

            user = self.get_user(request)
            serializer = CoordinateSerializer(coordinates)

            if coordinates.user.id == user.id:
                return Response(serializer.data)
            
            return Response(status=401, data="Unauthorized")
        
        
        def put(self, request, id=None):
            coordinates = self.get_object(id)
            
            if coordinates is None:
                return Response(status=404, data="Not Found")

            user = self.get_user(request)
            serializer = CoordinateSerializer(coordinates, data=request.data, partial=True)
            if serializer.is_valid() and coordinates.user.id == user.id:
                serializer.update(id)
                return Response(serializer.data, status=201)
            return Response(serializer.error_messages,status=401)
        
        def delete(self, request, id=None):
            coordinates = self.get_object(id)

            if coordinates is None:
                return Response(status=404, data="Not Found")
            
            user = self.get_user(request)
            if coordinates.user.id == user.id:
                coordinates.delete()
                return Response("Deleted", status=204)
            
            return Response(status=401, data="Unauthorized")