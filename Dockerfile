# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || pnpm install || yarn install
COPY . .
RUN npm run build || pnpm build || yarn build || true

FROM node:20-alpine

RUN addgroup -g 1001 nodeuser && adduser -u 1001 -G nodeuser -h /app -H -D nodeuser
COPY --from=builder /app /app

WORKDIR /app

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["node", "server.js"]
