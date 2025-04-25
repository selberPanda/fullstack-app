# Development stage
FROM node:23.9.0 as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "npm", "run", "dev" ]

# Production stage
FROM node:23.9.0 as production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "npm", "start" ]
