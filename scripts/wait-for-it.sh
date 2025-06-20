#!/usr/bin/env bash

HOST=$(echo $1 | cut -d: -f1)
PORT=$(echo $1 | cut -d: -f2)

echo "⏳ Waiting for $HOST:$PORT to be ready..."

while ! nc -z $HOST $PORT; do
  sleep 1
done

echo "✅ $HOST:$PORT is available. Starting application..."
exec "${@:2}"