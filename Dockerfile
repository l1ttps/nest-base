# Use official Node.js image as base
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire workspace
COPY . .

# Build all apps and libraries
RUN npm run build

# Use a lighter Node.js image for the runtime
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Run the application
CMD ["node", "dist/apps/api/main.js"]
