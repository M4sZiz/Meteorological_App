from django.urls import path, include

from .views import coordinatesView
from .views import coordinatesDetailView

urlpatterns = [
    path('', coordinatesView.as_view(), name='coordinates'),
    path('<int:id>/', coordinatesDetailView.as_view(), name='coordinates')
]
