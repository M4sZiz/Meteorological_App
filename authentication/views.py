from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from .serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTStatelessUserAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.
class RegisterView(APIView):

    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
    def post(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()

            username = serializer.data['username']
            password = request.data['password']
            
            user = authenticate(username=username, password=password)

            if not user:
                return Response({"error": "somthing wrong"}, status=400)

            token = RefreshToken.for_user(user)
            data = serializer.data
            data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}

            return Response(data,status=200)

        return Response(serializer.errors,status=400)
    

class LoginView(APIView):

    permission_classes = (AllowAny, )
    serializer_class = LoginSerializer

    def post(self, request, fotmat=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.userLogin()
            if not user:
                return Response({"error": "Invalid username or password"}, status=400)
            token = RefreshToken.for_user(user)
            data = serializer.data
            data["tokens"] = {"refresh": str(token), "access": str(token.access_token)}
            return Response(data,status=200)
        return Response(serializer.error_messages,status=500)
    

class HomeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTStatelessUserAuthentication]

    def get(self, request):
        return Response({"message": "Hello, World!"})