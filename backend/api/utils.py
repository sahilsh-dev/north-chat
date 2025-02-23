from django.core.cache import cache
from django.conf import settings


def is_user_online(user_id):
    return cache.get(f'online_{user_id}', False)

def set_user_online(user_id):
    cache.set(f'online_{user_id}', True, timeout=settings.USER_ONLINE_TIMEOUT)

def set_user_offline(user_id):
    cache.remove(f'online_{user_id}')
