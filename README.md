# NE Syrtis–Jezero 3D viewer

A 3d viewer for NE Syrtis Major and Jezero crater.
See the demo at https://dev.macrostrat.org/mars/syrtis-jezero/.

## Setting up:

Requires `mbtiles` files for imagery layers to be in `data` directory.

`make` installs for production. Backend services are set up using Docker, and the frontend is installed separately with webpack.

## Projected area:

Upper left: 74.4 19.5
Lower right: 78.7 15.8


# Updates for Kubernetes

- Move from Tessera to PMTiles-backed server for raster tiles (so tiles can live in S3)
- Gateway is unnecessary in Kubernetes
