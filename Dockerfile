# ---- Base Node image ----
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies (only package.json and lock first for better caching)
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the TypeScript code to dist/
RUN npm run build


# ---- Production image ----
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only built code and node_modules from build stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/tsconfig.json ./
COPY --from=base /app/prisma ./prisma
# COPY --from=base /app/public ./public

RUN mkdir -p /app/public

ENV DATABASE_URL="postgresql://postgres:P@55w0rdpg4dm1n@makna.vncnttan.my.id:5432/garuda-hack-6.0-be?schema=public"

RUN npx prisma generate

# Document environment variables
ENV NODE_ENV=production
# Required: DATABASE_URL, JWT_SECRET, FRONTEND_URL, PORT

# Run Prisma migrations on container start (optional, comment if not needed)
RUN npx prisma migrate deploy

# Expose the port (default 3000, can be overridden)
EXPOSE 3000

CMD ["npm", "run", "start"]