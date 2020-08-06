# Note: this doesn't build text with pandoc
from node:12-alpine
RUN npm install -g linklocal

# Install cesium-martini
WORKDIR /frontend/bundledDeps/cesium-martini
COPY bundledDeps/cesium-martini .
RUN npm install && npm run build

WORKDIR /frontend

COPY package.json .
RUN npm install

COPY ./ ./

ENV NODE_ENV=production
ENV API_BASE_URL=/tiles

RUN node_modules/.bin/webpack
