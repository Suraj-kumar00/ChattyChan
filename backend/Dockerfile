# Stage 1: Builder for dependencies and Prisma client generation
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies) for Prisma generation
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Stage 2: Production image
FROM node:18-alpine

# set up the working directory
WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma-related files from builder
COPY --from=builder /app/prisma ./prisma

# Copy application source code
COPY . .

# Make init script executable
RUN chmod +x init.sh

# Expose port
EXPOSE 5001

# Run init script that handles migrations, seeding, and starts the app
CMD ["./init.sh"]