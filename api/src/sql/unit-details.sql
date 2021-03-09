SELECT fid, mu.unit_id, mu.map_id, mu.color, pattern
FROM map_units mu
JOIN unit_symbology us
  ON mu.unit_id = us.unit_id
 AND mu.map_id = us.map_id
WHERE ST_Intersects(
  ST_Transform(
    ST_SetSRID(
      ST_MakePoint(${x}, ${y}),
      4326
    ),
  900916),
geometry)