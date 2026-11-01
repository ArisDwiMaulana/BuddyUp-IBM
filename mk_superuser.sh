#!/usr/bin/env bash
# mk_superuser.sh — Create a PocketBase superuser/admin account
# Supported on: Linux, macOS, WSL, Git Bash

set -e

CONTAINER_NAME="buddyup-pocketbase"

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "=========================================="
  echo "  BuddyUp — PocketBase Superuser Creator  "
  echo "=========================================="
  echo "Usage:"
  echo "  ./mk_superuser.sh <username_or_email> <password>"
  echo ""
  echo "Examples:"
  echo "  ./mk_superuser.sh admin password123"
  echo "  ./mk_superuser.sh admin@buddyup.com password123"
  echo "=========================================="
  exit 1
fi

EMAIL="$1"
PASSWORD="$2"

# If input does not contain '@', append '@buddyup.com'
if [[ "$EMAIL" != *"@"* ]]; then
  EMAIL="${EMAIL}@buddyup.com"
  echo "[i] Username formatted as email: $EMAIL"
fi

# Check if docker is running
if ! docker info >/dev/null 2>&1; then
  echo "[!] Error: Docker is not running or current user does not have permission to access Docker."
  exit 1
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "[!] Container '${CONTAINER_NAME}' is not running."
  echo "    Starting container with docker-compose up -d..."
  docker-compose up -d
  sleep 3
fi

echo "[*] Creating superuser '$EMAIL' in container '$CONTAINER_NAME'..."

# Try 'superuser create' (PocketBase v0.23+), fallback to 'admin create' (older versions)
if docker exec "$CONTAINER_NAME" /pocketbase superuser create "$EMAIL" "$PASSWORD" --dir=/pb_data 2>/dev/null; then
  echo "[✓] Superuser '$EMAIL' successfully created!"
elif docker exec "$CONTAINER_NAME" pocketbase superuser create "$EMAIL" "$PASSWORD" --dir=/pb_data 2>/dev/null; then
  echo "[✓] Superuser '$EMAIL' successfully created!"
elif docker exec "$CONTAINER_NAME" /pocketbase admin create "$EMAIL" "$PASSWORD" --dir=/pb_data 2>/dev/null; then
  echo "[✓] Superuser '$EMAIL' successfully created!"
elif docker exec "$CONTAINER_NAME" pocketbase admin create "$EMAIL" "$PASSWORD" --dir=/pb_data; then
  echo "[✓] Superuser '$EMAIL' successfully created!"
else
  echo "[!] Failed to create superuser. Please ensure container is healthy and password meets PocketBase minimum length (at least 8 characters)."
  exit 1
fi

echo ""
echo "You can now log in to the PocketBase Admin Panel at:"
echo "👉 http://localhost:8090/_/"
