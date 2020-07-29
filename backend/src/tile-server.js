const appFactory = require("tessera");
let tilelive = require("@mapbox/tilelive");
const express = require("express");
const responseTime = require("response-time");
const cors = require("cors");
const morgan = require("morgan");
const loader = require("tilelive-modules/loader");
const tileliveCache = require("tilelive-cache");

// have to require mbtiles to make sure it is consumed by loader
// when we have packaged the server
require("@mapbox/mbtiles");

// This tile server is based on the tessera server.js code.

const tileServer = function (opts) {
  if (typeof opts === "string") {
    opts = { "/": opts };
  }

  const app = express().disable("x-powered-by");
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }

  // Real tessera server caches, we don't.
  tilelive = require("@mapbox/tilelive");
  tilelive = tileliveCache(tilelive);

  loader(tilelive, {});

  for (let prefix in opts) {
    const uri = opts[prefix];
    app.use(prefix, responseTime());
    app.use(prefix, cors());
    // Uses `davenquinn/tessera`
    // so we don't have to load mapnik native modules
    // to run the tile server on weird architectures
    app.use(prefix, appFactory(tilelive, uri));
  }

  return app;
};

module.exports = tileServer;
