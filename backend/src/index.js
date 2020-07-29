const tileServer = require("./tile-server");
const express = require("express");
const path = require("path");

const dataset = (id) => {
  return (
    "mbtiles://" + path.resolve(__dirname, "..", "..", "data", id + ".mbtiles")
  );
};

const opts = {
  "/terrain": dataset("dem.terrain-rgb"),
  "/ctx-global": dataset("ctx-global"),
};

console.log(opts);

const app = tileServer(opts);

app.listen(3000);
