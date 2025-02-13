from datetime import datetime
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Friendship, Message
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        try:
            self.room = await database_sync_to_async(Friendship.objects.get)(id=self.room_id)
        except:
            print('Room not found', self.room_id)
            await self.close()
            return

        if self.scope['user'].is_anonymous or (
            self.scope['user'].id not in [self.room.user1_id, self.room.user2_id]
        ):
            print(f'User with id:{self.scope["user"].id} - {self.scope["user"].username} ' \
                  f'is not allowed to access room {self.room_id}')
            await self.close()
            return
        await self.accept()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            content = text_data_json['message']
            sender = self.scope['user']
            print('Message received:', content)
            # await self.save_message(sender, message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'content': content,
                    'sender_id': sender.id,
                }
            )
        except:
            print('Error in message sent from client')
            return

    async def chat_message(self, event):
        try:
            content = event['content']
            sender_id = event['sender_id']
            created_at = str(datetime.now())
            await database_sync_to_async(Message.objects.create)(
                sender=self.scope['user'], room=self.room, content=content
            )
            await self.send(text_data=json.dumps({
                'type': 'chat',
                'message': {
                    'content': content,
                    'sender_id': sender_id,
                    'created_at': created_at,
                }
            }))
        except:
            print('Failed to send message to client')
            return
