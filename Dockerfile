# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Rebuild esbuild for current platform
RUN npm rebuild esbuild

# Build the project
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production \
    && rm -rf /root/.npm

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Clean up
RUN npm cache clean --force \
    && rm -rf /tmp/* \
    && rm -rf /var/cache/apk/*

EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"]