from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Room, Message
from .serializers import UserSerializer, RoomSerializer, MessageSerializer

# Create your views here.
class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response("Hello, world!")


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class RoomView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class MessageView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get('room', None)
        if room_id:
            return Message.objects.filter(room_id=room_id)
        return Message.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
