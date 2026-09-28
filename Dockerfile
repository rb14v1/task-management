# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || pnpm install || yarn install
COPY . .
RUN npm run build

FROM node:20-alpine

COPY --from=builder /app /app

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz || exit 1

CMD ["node", "server.js"]
