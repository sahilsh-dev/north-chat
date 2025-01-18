from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Room, Message

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'created_at', 'created_by']
        read_only_fields = ['created_by']

class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'user', 'username', 'content', 'timestamp']
        read_only_fields = ['user']
