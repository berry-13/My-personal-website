FROM oven/bun:1.2-debian AS build
WORKDIR /app
COPY node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build:client

FROM oven/bun:1.2-debian
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "server/index.ts"]
