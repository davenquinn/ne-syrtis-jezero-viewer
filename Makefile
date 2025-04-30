.PHONY: start

start:
	docker compose up --build --force-recreate -d
	docker compose logs -f

update:
	cd vector-tiles && make views
	make clear_cache

process-dem:
	docker run --rm -ti -v $(shell pwd)/data:/data \
		helmi03/rio-rgbify --max-z 13 --min-z 6 \
		-b -10000 -i 0.1 --format png \
		dem-mercator.tif dem.terrain-rgb.mbtiles

server-image:
	cd gateway && publish-server.sh
