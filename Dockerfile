# # Builder Stage
# FROM node:18 AS builder

# # Environment variable to set the API URL
# ENV NEXT_PUBLIC_BACKEND_DEV=api/dev
# ENV NEXT_PUBLIC_BACKEND_PROD=api/prod

# ENV NEXT_UPLOAD_DIR=/app/public

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the working directory
# COPY . .

# # Build the Next.js application
# RUN npm run build

# # Runtime Stage
# FROM node:18-slim

# # install necessary tools for managing permissions
# RUN apt-get update && apt-get install -y sudo  \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# # Set the working directory inside the container
# WORKDIR /app

# # Copy only the necessary files from the builder stage
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules

# RUN mkdir -p /app/public/uploads/images && mkdir -p /app/public/uploads/music

# # ensure correct permissions for public folder
# RUN chown -R 1000:1000 /app/public/uploads && chown -R 1000:1000 /app/public/uploads/images && chown -R 1000:1000 /app/public/uploads/music

# RUN chmod -R 775 /app/public && chmod -R 775 /app/public/uploads && chmod -R 775 /app/public/uploads/images && chmod -R 775 /app/public/uploads/music

# USER 1000:1000

# # Expose the port that the Next.js application will run on
# EXPOSE 3000

# # Start the Next.js application
# CMD ["npm", "start"]

FROM docker.io/oven/bun:latest

ENV PUBLIC_BACKEND=/api

WORKDIR /app
COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . /app

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]