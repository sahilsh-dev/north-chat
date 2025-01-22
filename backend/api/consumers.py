from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Friendship, Message
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room = await database_sync_to_async(Friendship.objects.get)(chat_room=self.room_id)

        if self.scope['user'].is_anonymous and (
            self.scope['user'] not in [self.room.user1, self.room.user2]
        ):
            await self.close()
            return
        self.room_group_name = f'chat_{self.room.chat_room}'
        await self.accept()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.send_message(f'{self.scope["user"].username} is now Online', self.scope['user'])


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def send_message(self, message, sender):
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender.username,
                'timestamp': str(message.created_at)
            }
        )
        await database_sync_to_async(self.room.messages.add(message))()


    # async def receive(self, text_data):
    #     data = json.loads(text_data)
    #     message = data['message']
    #     sender = self.scope["user"]
    #     room_id = self.room_name
    #
    #     # Save message to database
    #     await self.save_message(sender, room_id, message)
    #
    #     # Send message to room group
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             'type': 'chat_message',
    #             'message': message,
    #             'sender': sender.username,
    #             'timestamp': str(datetime.datetime.now())
    #         }
    #     )
