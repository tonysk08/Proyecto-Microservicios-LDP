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
RUN npm run build catalog-service

#------ Stage 2: Producction  ------
FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./

#solo instala dependencias de producción
RUN npm ci --only=production

COPY --from=builder /app/dist/apps/catalog-service ./dist/apps/catalog-service

CMD ["node", "dist/apps/catalog-service/main.js"]