# Note: this doesn't build text with pandoc
FROM node:12-alpine
RUN npm install -g linklocal

# Install cesium-martini
WORKDIR /frontend/bundledDeps/cesium-martini
COPY bundledDeps/cesium-martini .
RUN npm install && npm run build

WORKDIR /frontend

COPY package.json .
RUN npm install

COPY ./ ./

ARG PUBLIC_URL=""
ARG NODE_ENV=production
ARG API_BASE_URL=${PUBLIC_URL}/tiles

RUN node_modules/.bin/webpack
