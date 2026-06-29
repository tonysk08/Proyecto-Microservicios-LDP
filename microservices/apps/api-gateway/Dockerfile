#------ Stage 1: Builder  ------
FROM node:22.14.0-alpine AS builder

WORKDIR /app

#Copia dependiencias primero
COPY package*.json ./
COPY nest-cli.json ./
COPY webpack.config.js ./
COPY tsconfig*.json ./

RUN npm install

# Copia el código fuente
COPY apps/ ./apps/
COPY libs/ ./libs/

# Compila solo el api-gateway
RUN npm run build api-gateway

#------ Stage 2: Producction  ------
FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./

#solo instala dependencias de producción
RUN npm ci --only=production

COPY --from=builder /app/dist/apps/api-gateway ./dist/apps/api-gateway

# Usuario no-root (incluido en la imagen oficial de node)
USER node

EXPOSE 3000

# Healthcheck HTTP (Swagger JSON disponible en entornos no productivos)
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -O- http://localhost:3000/api/docs-json > /dev/null 2>&1 || exit 1

CMD ["node", "dist/apps/api-gateway/main.js"]