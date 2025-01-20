from django.urls import path
from .views import (
    RegisterView,
    FriendshipView,
    CreateFriendRequestView,
    AcceptFriendRequestView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register-user'),
    path('friends/', FriendshipView.as_view(), name='friends-list'),
    path('friends/create/', CreateFriendRequestView.as_view(), name='create-friend-request'),
    path('friends/accept/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
]
