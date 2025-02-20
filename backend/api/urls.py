from django.urls import path
from .views import (
    UserView,
    RegisterView,
    UserFriendsView,
    CreateFriendRequestView,
    AcceptFriendRequestView,
    ChatHistoryView
)

urlpatterns = [
    path('users/', UserView.as_view(), name='user-detail'),
    path('register/', RegisterView.as_view(), name='register-user'),
    path('friends/', UserFriendsView.as_view(), name='friends-list'),
    path('friends/create/', CreateFriendRequestView.as_view(), name='create-friend-request'),
    path('friends/accept/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('chat/<int:user_id>/', ChatHistoryView.as_view(), name='chat-history')
]
