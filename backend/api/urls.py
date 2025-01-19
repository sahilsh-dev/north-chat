from django.urls import path
from .views import HomeView, RegisterView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('register/', RegisterView.as_view(), name='register'),
]
