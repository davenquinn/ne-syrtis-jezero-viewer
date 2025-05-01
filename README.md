# NE Syrtis–Jezero 3D viewer

A 3d viewer for NE Syrtis Major and Jezero crater.
See the demo at https://dev.macrostrat.org/mars/syrtis-jezero/.

## Projected area:

Upper left: 74.4 19.5
Lower right: 78.7 15.8

## Anticipated roadmap

- `1.0`: Based on global dynamic tile layers for elevation
- `2.0`: Replace custom maps schema with ~Macrostrat-compatible compositing system

# Updates for Kubernetes

This is now based on a data backend in the CHTC infrastructure at UW–Madison, backed by Kubernetes.


- Move from Tessera to PMTiles-backed server for raster tiles (so tiles can live in S3)
- Gateway is unnecessary in Kubernetes
