import { readdirSync } from "fs";
import PGPromise from "pg-promise";
import path from "path";
import Bluebird from "bluebird";
// This query cache function was taken from
// https://github.com/davenquinn/mapboard-server/blob/v2/src/database.ts

type SQLCache = {
  [key: string]: PGPromise.QueryFile;
};

export const pgp = PGPromise({
  promiseLib: Bluebird,
  connect(client, dc, isFresh) {
    if (isFresh) {
      console.log("Connected to database");
    }
  },
});

export function buildQueryCache(directory: string, params: any): SQLCache {
  //# Prepare SQL queries
  const sql: SQLCache = {};
  for (let fn of Array.from(readdirSync(directory))) {
    const key = path.basename(fn, ".sql");
    const _ = path.join(directory, fn);
    const qf = new pgp.QueryFile(_, {
      minify: true,
      debug: true,
      params,
    });

    if (qf.error) {
      // Something is wrong with our query file :(
      // Testing all files through queries can be cumbersome,
      // so we also report it here, while loading the module:
      console.error(qf.error);
    }

    sql[key] = qf;
  }
  return sql;
}

export const queryCache = buildQueryCache(path.join(__dirname, "/sql"), {});
