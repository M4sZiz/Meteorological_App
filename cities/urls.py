from django.urls import path
from .views import CitiesView
from .views import CitiesDetailView

urlpatterns = [
    path('', CitiesView.as_view()),
    path('<int:id>/', CitiesDetailView.as_view()),
]
