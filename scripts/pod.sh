#!/bin/bash

# Variables
APP_NAME=playground
CONTAINER_NAME=playground-container
POD_NAME=playground-pod

# Ensure the scripts directory is the working directory
cd "$(dirname "$0")"

# Create .env file if it doesn't exist
if [ ! -f ../.env ]; then
  cat <<EOF > ../.env
NEXT_PUBLIC_BACKEND_DEV=http://localhost:8001
NEXT_PUBLIC_BACKEND_PROD=http://localhost:8000
EOF
fi

# Export environment variables from .env file
export $(grep -v '^#' ../.env | xargs)

# Remove the existing container if it exists
podman rm -f $CONTAINER_NAME

# Build the Docker image
podman build -t $APP_NAME ..

# # Remove the existing pod if it exists
# podman pod rm -f $POD_NAME

# # Create a new pod
# podman pod create --name $POD_NAME -p 3000:3000 -p 8001:8001 -p 8000:8000

# # Run the container in the pod
# podman run -d --name $CONTAINER_NAME --pod $POD_NAME $APP_NAME
