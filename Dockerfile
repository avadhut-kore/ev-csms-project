# Step 1: Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Set working directory inside container
WORKDIR /app

# Install dependencies only
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the app files
COPY . .

# Step 2: Build the app
FROM base AS build

# Set environment variables
ENV NODE_ENV=production

# Build the app
RUN yarn build

# Step 3: Create a production image
FROM node:18-alpine AS production

# Set working directory inside container
WORKDIR /app

# Copy the app from the build stage
COPY --from=build /app /app

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Expose port 3000
EXPOSE 3000

# Run the app
CMD ["yarn", "start"]
