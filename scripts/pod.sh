#!/bin/bash

# Variables
APP_NAME=playground
CONTAINER_NAME=playground-container
POD_NAME=playground-pod
HOST_VOLUME_PATH=/www/conexus-categories/images
CONTAINER_VOLUME_PATH=/app/public
USER_ID=1000
GROUP_ID=1000
# USER_ID=$(id -u)
# GROUP_ID=$(id -g)

# Ensure the scripts directory is the working directory
cd "$(dirname "$0")"

# Create .env file if it doesn't exist
if [ ! -f ../.env ]; then
  cat <<EOF > ../.env
NEXT_PUBLIC_BACKEND_DEV=api/dev
NEXT_PUBLIC_BACKEND_PROD=api/prod

NEXT_UPLOAD_DIR=public
EOF
fi

# Export environment variables from .env file
export $(grep -v '^#' ../.env | xargs)

# Remove the existing container if it exists
podman rm -f $CONTAINER_NAME

# Build the Docker image
podman build -t $APP_NAME ..

# Remove the existing pod if it exists
podman pod rm -f $POD_NAME

# Create a new pod
podman pod create --name $POD_NAME -p 3031:3000

# Run the container in the pod
# podman run -d --name $CONTAINER_NAME --pod $POD_NAME $APP_NAME
podman run -d \
  --name $CONTAINER_NAME \
  --pod $POD_NAME \
  --user $USER_ID:$GROUP_ID \
  --volume $HOST_VOLUME_PATH:$CONTAINER_VOLUME_PATH:Z \
  $APP_NAME
