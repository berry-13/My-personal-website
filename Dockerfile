FROM oven/bun:1.3.13-debian AS build
WORKDIR /app
RUN echo "precedence ::ffff:0:0/96 100" >> /etc/gai.conf
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM oven/bun:1.3.13-debian
WORKDIR /app
COPY --from=build --chown=bun:bun /app/dist ./dist
USER bun
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "dist/server/index.js"]
