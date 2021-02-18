all:
	docker-compose up --build --force-recreate -d
	docker-compose logs -f & API_BASE_URL=http://localhost:4053 npm run dev:frontend

clear_cache:
	docker-compose run gateway rm -rf /cache/

process-dem:
	docker run --rm -ti -v $(shell pwd)/data:/data \
		helmi03/rio-rgbify --max-z 13 --min-z 6 \
		-b -10000 -i 0.1 --format png \
		dem-mercator.tif dem.terrain-rgb.mbtiles
