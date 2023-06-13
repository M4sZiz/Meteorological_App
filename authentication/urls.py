from django.urls import path
from .views import RegisterView
from .views import LoginView
from .views import HomeView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('user/', HomeView.as_view(), name="index")
]
