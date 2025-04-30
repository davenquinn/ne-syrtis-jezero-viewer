CREATE ROLE postgrest LOGIN NOINHERIT NOCREATEDB NOCREATEROLE NOSUPERUSER;

-- For someone who is not logged in
CREATE ROLE web_anon NOLOGIN;

-- Postgrest is our 'authenticator' role
-- We need to allow it to switch to the web roles
GRANT web_anon TO postgrest;
-- this is the login user we use for now...
GRANT web_anon TO "mars-admin";

CREATE SCHEMA IF NOT EXISTS map_units_api;
GRANT USAGE ON SCHEMA map_units_api TO web_anon;


CREATE ROLE web_anon WITH LOGIN NOINHERIT;
GRANT USAGE ON SCHEMA map_units_api TO web_anon;
-- Allow the login user to SET ROLE to web_anon

CREATE OR REPLACE FUNCTION map_units_api.get_units(
  x float8,
  y float8
) RETURNS SETOF record AS $$
  SELECT fid, mu.unit_id, mu.map_id, mu.color, pattern
  FROM map_units mu
  JOIN unit_symbology us
    ON mu.unit_id = us.unit_id
   AND mu.map_id = us.map_id
  WHERE ST_Intersects(
    ST_Transform(
      ST_SetSRID(
        ST_MakePoint(x, y),
        4326
      ),
      3857
    ),
    geometry
  );
$$ LANGUAGE SQL STABLE;

NOTIFY pgrst, 'reload schema';

GRANT EXECUTE ON FUNCTION map_units_api.get_units(float8, float8) TO web_anon;
GRANT SELECT ON map_units, unit_symbology TO web_anon;
