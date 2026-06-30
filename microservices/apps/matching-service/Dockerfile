#------ Stage 1: Builder  ------
FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY webpack.config.js ./
COPY tsconfig*.json ./

RUN npm install

COPY apps/ ./apps/
COPY libs/ ./libs/

# Compila solo el matching-service
RUN npm run build matching-service

#------ Stage 2: Production  ------
FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist/apps/matching-service ./dist/apps/matching-service

# Usuario no-root
USER node

# Sin HEALTHCHECK HTTP: microservicio RMQ puro (sin servidor HTTP).

CMD ["node", "dist/apps/matching-service/main.js"]
