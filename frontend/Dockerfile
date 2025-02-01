# Builder stage
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of the application files after dependencies are installed
COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy only the build output and dependencies from the builder stage
COPY --from=builder /app /app

# Expose port 5173 for the application
EXPOSE 5173

# Run the app in production mode
CMD ["npm", "run", "dev"]
