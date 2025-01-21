from django.urls import path
from .views import (
    UserView,
    RegisterView,
    FriendshipView,
    CreateFriendRequestView,
    AcceptFriendRequestView
)

urlpatterns = [
    path('users/', UserView.as_view(), name='user-detail'),
    path('register/', RegisterView.as_view(), name='register-user'),
    path('friends/', FriendshipView.as_view(), name='friends-list'),
    path('friends/create/', CreateFriendRequestView.as_view(), name='create-friend-request'),
    path('friends/accept/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
]
