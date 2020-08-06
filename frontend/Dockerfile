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

# Note: this doesn't build text with pandoc

RUN NODE_ENV=production node_modules/.bin/webpack
