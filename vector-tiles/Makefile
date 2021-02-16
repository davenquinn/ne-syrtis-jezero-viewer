JEZ_DB := datasets/sim3464_JezeroNili_FINAL/Geodatabase/Nili.gdb
PG_CONN := PG:"host=localhost port=54321 dbname=mars_syrtis user=postgres" 

all: jezero_map

jezero_map:
	psql -p 54321 -h localhost -U postgres mars_syrtis -c "CREATE SCHEMA jezero_usgs"
	ogr2ogr -f "PostgreSQL" \
		$(PG_CONN) \
    $(JEZ_DB) \
		-nln jezero_usgs.units GeoUnits_v1 \
    -overwrite -progress --config PG_USE_COPY YES
	ogr2ogr -f "PostgreSQL" \
		$(PG_CONN) \
    $(JEZ_DB) \
		-nln jezero_usgs.lines LinearFeatures \
    -overwrite -progress --config PG_USE_COPY YES
	ogr2ogr -f "PostgreSQL" \
		$(PG_CONN) \
    $(JEZ_DB) \
		-nln jezero_usgs.names Nomenclature \
    -overwrite -progress --config PG_USE_COPY YES