import logging
import json
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import Friendship, Message
from .utils import set_user_online, set_user_offline

logger = logging.getLogger(__name__)
User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        try:
            self.room = await database_sync_to_async(Friendship.objects.get)(id=self.room_id)
        except:
            logger.info(f'Room not found {self.room_id}')
            await self.close()
            return

        if self.scope['user'].is_anonymous or (
            self.scope['user'].id not in [self.room.user1_id, self.room.user2_id]
        ):
            logger.info(f'User with id:{self.scope["user"].id} - {self.scope["user"].username} ' \
                  f'is not allowed to access room {self.room_id}')
            await self.close()
            return
        await self.accept()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        logger.info(f'User with id:{self.scope["user"].id} - {self.scope["user"].username} '
              f'joined room {self.room_id}') 

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
            logger.info(f'Message received: {content}')

            sender = self.scope['user']
            created_at = timezone.now()
            await database_sync_to_async(Message.objects.create)(
                sender=sender, room=self.room, content=content, created_at=created_at
            )
            logger.info(f'Message saved to database: {content}')
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'content': content,
                    'sender_id': sender.id,
                    'created_at': created_at,
                }
            )
        except:
            logger.info('Error in message sent from client')
            return

    async def chat_message(self, event):
        try:
            content = event['content']
            sender_id = event['sender_id']
            created_at = event['created_at']
            await self.send(text_data=json.dumps({
                'type': 'chat',
                'message': {
                    'content': content,
                    'sender_id': sender_id,
                    'created_at': created_at.isoformat(),
                }
            }))
        except:
            logger.info('Failed to send message to client')
            return


class OnlineStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close()
            return
        await self.accept()
        await self.channel_layer.group_add(
            f'online_status_{self.user.id}',
            self.channel_name
        )
        set_user_online(self.user.id)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        logger.info(f'Received: {text_data_json}')
        set_user_online(self.user.id)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f'online_status_{self.user.id}',
            self.channel_name
        )
        set_user_offline(self.user.id)
