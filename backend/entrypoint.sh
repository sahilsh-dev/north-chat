#!/usr/bin/env sh

echo "Applying database migrations"
python manage.py migrate

exec "$@"
