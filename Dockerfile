FROM node:14-alpine AS build

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /build

# Copy package and package-lock 
COPY package.json package-lock.json ./

# Clean install dependencies based package-lock
# Note: We also install dev deps as typeScript may be needed
RUN npm ci

# Copy files
# Use .dockerignore to avoid copying node_modules and others folders and files
COPY . .

# Build application
RUN npm run build

# =======================================
# Image generate dependencies production
# =======================================
FROM node:14-alpine AS dependencies

# Environment Production
ENV NODE_ENV production

WORKDIR /dependencies

# Copy package and package-lock 
COPY --from=build /build/package.json .
COPY --from=build /build/package-lock.json ./

# Clean install dependencies based package-lock
RUN npm ci --production

# =======================================
# Image distroless final
# =======================================
FROM gcr.io/distroless/nodejs:14

# Mark as prod, disable telemetry, set port
ENV NODE_ENV production
ENV PORT 3000
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Copy from build
COPY --from=build /build/next.config.js .
COPY --from=build /build/public/ ./public
COPY --from=build /build/.next ./.next
COPY --from=dependencies /dependencies/node_modules ./node_modules

EXPOSE 3000

# Run app command
CMD ["node_modules/.bin/next", "start"]
