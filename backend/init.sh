#!/bin/sh

# Run database migrations
npx prisma migrate deploy

# Run seed script
node src/seeds/user.seed.js

# Start the application
npm run dev 