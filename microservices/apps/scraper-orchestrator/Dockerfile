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

RUN npm run build scraper-orchestrator

#------ Stage 2: Production  ------
FROM node:22.14.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist/apps/scraper-orchestrator ./dist/apps/scraper-orchestrator

# Usuario no-root
USER node

# Sin HEALTHCHECK HTTP: microservicio RMQ puro (sin servidor HTTP).

CMD ["node", "dist/apps/scraper-orchestrator/main.js"]
