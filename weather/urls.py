from django.urls import path
from .views import weatherView
urlpatterns = [
    path('details/', weatherView.as_view(), name='weather'),
]