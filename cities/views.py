from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import CitySerializers

from .models import City

# Create your views here.
class CitiesView(APIView):

    permission_classes = [AllowAny]
    serializer_class = CitySerializers

    def get(self, request):
        cities = City.objects.all()
        serializer = CitySerializers(cities, many=True)
        return Response(serializer.data)

class CitiesDetailView(APIView):
    
        permission_classes = [AllowAny]
        serializer_class = CitySerializers
    
        def get_object(self, id):
            try:
                return City.objects.get(id=id)
            except City.DoesNotExist:
                return Response(status=404)
            

        def get(self, request, id=None):
            cities = self.get_object(id)
            serializer = CitySerializers(data=cities)
            if serializer.is_valid():
                return Response(serializer.data)
            return Response(serializer.error_messages,status=500)
