from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Friendship, FriendRequestCode


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class FrienshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2', 'chat_room']


class FriendRequestCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequestCode
        fields = ['code', 'sender', 'created_at']


class AcceptFriendRequestSerializer(serializers.Serializer):
    code = serializers.CharField()


# class MessageSerializer(serializers.ModelSerializer):
#     sender_username = serializers.CharField(source='sender.username', read_only=True)
#
#     class Meta:
#         model = Message
#         fields = ['id', 'sender', 'sender_username', 'content', 'timestamp']
#         read_only_fields = ['sender']
#
#
# class ChatRoomSerializer(serializers.ModelSerializer):
#     last_message = serializers.SerializerMethodField()
#     other_participant = serializers.SerializerMethodField()
#
#     class Meta:
#         model = ChatRoom
#         fields = ['id', 'participants', 'last_message', 'other_participant']
#
#     def get_last_message(self, obj):
#         last_message = obj.messages.last()
#         if last_message:
#             return MessageSerializer(last_message).data
#         return None
#
#     def get_other_participant(self, obj):
#         request_user = self.context['request'].user
#         other_user = obj.participants.exclude(id=request_user.id).first()
#         return {
#             'id': other_user.id,
#             'username': other_user.username
#         } if other_user else None
#
