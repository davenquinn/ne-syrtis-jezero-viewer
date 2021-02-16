DROP MATERIALIZED VIEW map_units;
CREATE MATERIALIZED VIEW map_units AS
WITH units AS (
SELECT
	unit_name AS unit_id,
	ST_Transform(wkb_geometry, 900916) geometry,
	'watershed_goudge' map_id
FROM watershed_goudge.units
UNION ALL
SELECT
	name unit_id,
	ST_Transform(shape, 900916) geometry,
	'jezero_usgs' map_id
FROM jezero_usgs.units
UNION ALL
SELECT
	unit_id,
	ST_Transform(wkb_geometry, 900916) geometry,
	'sulfates_quinn' map_id
FROM sulfates_quinn.units
WHERE unit_id NOT IN ('noachian')
)
SELECT
	row_number() OVER () fid,
  unit_id,
  -- CAST THIS appropriately so it gets registered!
  -- https://postgis.net/docs/postgis_usage.html#Manual_Register_Spatial_Column
  geometry::geometry(MultiPolygon, 900916),
  map_id
FROM units;

CREATE INDEX map_units_geometry_index
  ON map_units
  USING GIST (geometry);


-- NOTE: Symbology for Jezero USGS map can be found at
-- https://planetarymapping.wr.usgs.gov/interactive/sim3464
INSERT INTO unit_symbology (unit_id, map_id)
SELECT DISTINCT ON (unit_id, map_id) unit_id, map_id FROM map_units
ON CONFLICT DO NOTHING;