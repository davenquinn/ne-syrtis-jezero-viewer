PG_ARGS := -p 54321 -h localhost -U postgres mars_syrtis

all: jezero_usgs sulfates_quinn watershed_goudge

JEZ_DB := datasets/sim3464_JezeroNili_FINAL/Geodatabase/Nili.gdb
jezero_usgs:
	psql $(PG_ARGS) -c "CREATE SCHEMA IF NOT EXISTS $@"
	./load-layer $@.units $(JEZ_DB) GeoUnits_v1 
	./load-layer $@.lines $(JEZ_DB) LinearFeatures
	./load-layer $@.names $(JEZ_DB) Nomenclature

sulfates_quinn:
	psql $(PG_ARGS) -c "CREATE SCHEMA IF NOT EXISTS $@"
	./load-layer $@.units datasets/geologic-map-shapefile/polygons.shp 
	./load-layer $@.lines datasets/geologic-map-shapefile/lines.shp

watershed_goudge:
	psql $(PG_ARGS) -c "CREATE SCHEMA IF NOT EXISTS $@"
	./load-layer $@.units \
		datasets/Goudge_et_al_2015_Jezero_Watershed_Map/Goudge_Final_Published_Jezero_Watershed_Map.shp

.PHONY: views
views: views.sql
	psql $(PG_ARGS) -f $^