# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm build

# Stage 2: Create the final image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["pnpm", "start"]