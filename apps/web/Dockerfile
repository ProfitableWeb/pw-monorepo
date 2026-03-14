# apps/web/Dockerfile — Next.js frontend (standalone)
# Build context: repo root (docker-compose context: .)

# --- Stage 1: Install dependencies ---
FROM oven/bun:1.2 AS deps

WORKDIR /app

# Копируем workspace-файлы для корректной установки
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# --- Stage 2: Build ---
FROM oven/bun:1.2 AS builder

WORKDIR /app

# Копируем зависимости из deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Копируем исходники
COPY packages/types ./packages/types
COPY apps/web ./apps/web
COPY package.json ./

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && bun run build

# --- Stage 3: Production runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаём непривилегированного пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копируем standalone-сервер и статику
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
