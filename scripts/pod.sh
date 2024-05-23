#!/bin/bash

# Variables
APP_NAME=my-nextjs-app
CONTAINER_NAME=my-nextjs-app-container
POD_NAME=my-nextjs-app-pod

# Ensure the scripts directory is the working directory
cd "$(dirname "$0")"

# Create .env file if it doesn't exist
if [ ! -f ../.env ]; then
  cat <<EOF > ../.env
NEXT_PUBLIC_API_URL=http://localhost:8080
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
podman pod create --name $POD_NAME -p 3000:3000 -p 8001:8001

# Run the container in the pod
podman run -d --name $CONTAINER_NAME --pod $POD_NAME $APP_NAME
