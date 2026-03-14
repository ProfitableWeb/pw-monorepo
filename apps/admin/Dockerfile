# apps/admin/Dockerfile — Vite SPA (статика через nginx)
# Build context: repo root (docker-compose context: .)

# --- Stage 1: Install dependencies ---
FROM oven/bun:1.2.17 AS deps

WORKDIR /app

# Копируем workspace-файлы для корректной установки
COPY package.json bun.lock ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/types/package.json ./packages/types/

# Устанавливаем зависимости
RUN bun install --frozen-lockfile

# --- Stage 2: Build ---
FROM oven/bun:1.2.17 AS builder

WORKDIR /app

# Копируем зависимости из deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules

# Копируем исходники
COPY packages/types ./packages/types
COPY apps/admin ./apps/admin
COPY package.json ./

# Build Vite SPA
RUN cd apps/admin && bun run build

# --- Stage 3: Serve static via nginx ---
FROM nginx:alpine AS runner

# Копируем собранную статику
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html/admin

# nginx конфиг для SPA (fallback на index.html)
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    \n\
    location /admin/ {\n\
        try_files $uri $uri/ /admin/index.html;\n\
    }\n\
    \n\
    location /admin/assets/ {\n\
        add_header Cache-Control "public, max-age=31536000, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
