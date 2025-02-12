from rest_framework import views, generics, permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Friendship, FriendRequestCode
from drf_spectacular.utils import extend_schema
from .serializers import (
    FriendRequestCodeSerializer,
    UserSerializer,
    AcceptFriendRequestSerializer,
    MessageSerializer
)


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class FriendshipView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """List all friends of the current user"""
        friends = Friendship.objects.get_friends(request.user)
        friends = [friend.user1 if friend.user2 == request.user else friend.user2 for friend in friends]
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data)


class CreateFriendRequestView(views.APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=FriendRequestCodeSerializer)
    def post(self, request):
        """Create a friend request code"""
        code = FriendRequestCode.objects.create_code(request.user)
        serializer = FriendRequestCodeSerializer(code)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AcceptFriendRequestView(views.APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=AcceptFriendRequestSerializer)
    def post(self, request):
        """Accept a friend request"""
        code = request.data.get('code')
        friend_request_code = get_object_or_404(FriendRequestCode, code=code)
        Friendship.objects.create(user1=friend_request_code.sender, user2=request.user)
        friend_request_code.delete()
        return Response({'success': True})


class ChatHistoryView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        """Get last messages between the current user and the user with the given id"""
        friends = Friendship.objects.get_user_friend(request.user, user_id)
        if not friends:
            return Response(
                {'error': 'You are not friends with this user'},
                status=status.HTTP_400_BAD_REQUEST
            )
        last_messages = friends.messages.all()[:30] # TODO: Add pagination
        print('Last messages: ', last_messages)
        serializer = MessageSerializer(last_messages, many=True)
        print('Serializer data: ', serializer.data)
        return Response({'room_id': friends.id, 'messages': serializer.data})
