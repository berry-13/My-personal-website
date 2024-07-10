FROM node:18.17.0-alpine AS build

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /build

COPY package.json package-lock.json ./

# Use --legacy-peer-deps to resolve dependency conflicts
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:18.17.0-alpine AS dependencies

# Set environment to production
ENV NODE_ENV production

WORKDIR /dependencies

# Copy package and package-lock 
COPY --from=build /build/package.json .
COPY --from=build /build/package-lock.json ./

# Clean install production dependencies based on package-lock
RUN npm ci --production

# Stage 3: Create the final image
FROM gcr.io/distroless/nodejs:14

# Set environment variables