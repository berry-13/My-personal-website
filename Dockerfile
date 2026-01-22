# use the official Bun image
FROM oven/bun:1.2-debian AS base
WORKDIR /usr/src/app

# copy pre-installed dependencies from host (installed in CI)
FROM base AS deps
COPY package.json bun.lock ./
COPY node_modules ./node_modules

# build stage
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# production stage - install only production deps
FROM base AS release
COPY package.json bun.lock ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN bun install --frozen-lockfile --production

COPY --from=build /usr/src/app/dist ./dist

USER bun
EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "dist/server/index.js"]
