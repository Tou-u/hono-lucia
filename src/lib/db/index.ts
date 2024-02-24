import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getConnection(DB: D1Database) {
  const db = drizzle(DB, { schema });
  return db;
}
