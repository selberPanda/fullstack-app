# Development stage
FROM node:23.9.0 as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Production stage
FROM caddy:2-alpine as production

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=development /app/dist /srv
