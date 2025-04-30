#/usr/bin/env bash
# Build the Docker container and publish it to the OpenScienceGrid Docker Hub

registry="hub.opensciencegrid.org"
image_name="$registry/macrostrat/caddy-pmtiles"
version="2.10.0"

# Checking that we can login to the OpenScienceGrid Docker Hub.
# You can find your secret token at https://hub.opensciencegrid.org/user/settings/tokens
docker login $registry

# Create a parallel multi-platform builder
docker buildx create --name multiplatform-builder --use

# Build the Docker image for linux/amd64 and linux/arm64 platforms
docker buildx build --push --platform linux/amd64,linux/arm64 \
  -t $image_name:latest \
  -t $image_name:$version .
