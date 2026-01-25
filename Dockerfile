FROM oven/bun:1.2-debian AS deps
WORKDIR /app
COPY package.json bun.lock ./
ENV BUN_CONFIG_NETWORK_PREFER_IPV4=true
RUN bun install --frozen-lockfile

FROM oven/bun:1.2-debian AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build:client

FROM oven/bun:1.2-debian
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "server/index.ts"]
