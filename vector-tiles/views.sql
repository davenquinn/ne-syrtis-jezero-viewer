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
	unit_name AS unit_id,
	ST_Transform(wkb_geometry, 900916) geometry,
	'syrtis_bramble' map_id
FROM syrtis_bramble.units
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
UNION ALL
SELECT
	'ol_ash' unit_id,
	ST_Transform(ST_Union(ST_MakeValid(wkb_geometry)), 900916) geometry,
	'ol_ash_kremer' map_id
FROM ol_ash_kremer.units
)
SELECT
	row_number() OVER () fid,
  u.unit_id,
  -- CAST THIS appropriately so it gets registered!
  -- https://postgis.net/docs/postgis_usage.html#Manual_Register_Spatial_Column
  ST_Simplify(
		ST_Translate(
			geometry,
			coalesce(d.offset_x, 0),
			coalesce(d.offset_y, 0)
		),
		1
	)::geometry(MultiPolygon, 900916) geometry,
  u.map_id,
  coalesce(s.color, '#888888') color
FROM units u
LEFT JOIN unit_symbology s
  ON s.unit_id = u.unit_id
 AND s.map_id = u.map_id
JOIN map_dataset d
  ON d.id = s.map_id
ORDER BY d.order DESC;

CREATE INDEX map_units_geometry_index
  ON map_units
  USING GIST (geometry);


-- NOTE: Symbology for Jezero USGS map can be found at
-- https://planetarymapping.wr.usgs.gov/interactive/sim3464
INSERT INTO unit_symbology (unit_id, map_id)
SELECT DISTINCT ON (unit_id, map_id) unit_id, map_id FROM map_units
ON CONFLICT DO NOTHING;