# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for build
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run start

# Generate Prisma Client
RUN npx prisma generate

# Production Stage
FROM node:20-alpine AS production

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install

# Copy built files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
# COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/.prisma ./node_modules/.prisma


RUN mkdir -p /app/public



# Set production environment
ENV NODE_ENV=production

# Use non-root user
USER nodejs


# Expose port
EXPOSE 3000

# Start the application
CMD ["npx", "run", "prisma", "migrate", "deploy","&&", "npm", "run", "start"]
