# Builder Stage
FROM node:18 AS builder

# Environment variable to set the API URL
ENV NEXT_PUBLIC_BACKEND_DEV=api/dev
ENV NEXT_PUBLIC_BACKEND_PROD=api/prod

ENV NEXT_UPLOAD_DIR=/app/public

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Runtime Stage
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# list directories
RUN ls -la

# Expose the port that the Next.js application will run on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]