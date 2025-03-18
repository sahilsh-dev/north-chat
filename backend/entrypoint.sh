#!/usr/bin/env sh

echo "Creating database migrations"
python manage.py makemigrations

echo "Applying database migrations"
python manage.py migrate

exec "$@"
