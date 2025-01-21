import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class FriendshipManager(models.Manager):
    def get_friends(self, user):
        return Friendship.objects.filter(Q(user1=user) | Q(user2=user))

    def get_user_friend(self, current_user, friend):
        return Friendship.objects.filter(
            Q(user1=current_user, user2=friend) | Q(user1=friend, user2=current_user)
        ).first()


class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2') 
    chat_room = models.CharField(max_length=100, blank=False, unique=True)
    objects = FriendshipManager()

    class Meta:
        unique_together = ['user1', 'user2']

    def save(self, *args, **kwargs):
        if self.user1 and self.user2 and self.user1 != self.user2:
            self.chat_room = f'{self.user1.username}_{self.user2.username}'
            return super().save()


class Message(models.Model):
    room = models.ForeignKey(Friendship, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']


class FriendRequestCodeManager(models.Manager):
    def create_code(self, sender):
        room_code = uuid.uuid4().hex[:6]
        room_code = FriendRequestCode.objects.create(code=room_code, sender=sender)
        room_code.save()
        return room_code


class FriendRequestCode(models.Model):
    code = models.CharField(max_length=6, unique=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    objects = FriendRequestCodeManager()

