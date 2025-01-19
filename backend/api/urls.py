from django.urls import path
from .views import HomeView, RegisterView, MessageView, RoomView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('register/', RegisterView.as_view(), name='register'),
    path('rooms/', RoomView.as_view(), name='rooms'),
    path('messages/', MessageView.as_view(), name='messages'),
]
