from rest_framework import serializers
from django.contrib.auth.models import User
from .utils import is_user_online
from .models import Friendship, FriendRequestCode, Message


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_online = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'is_online']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

    def get_is_online(self, obj):
        return is_user_online(obj.id)


class FrienshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'user1', 'user2']


class FriendRequestCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequestCode
        fields = ['code', 'sender', 'created_at']


class AcceptFriendRequestSerializer(serializers.Serializer):
    code = serializers.CharField()


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender_id', 'content', 'created_at']
