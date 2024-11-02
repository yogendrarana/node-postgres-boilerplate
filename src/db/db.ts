import pg from "pg";
import * as schema from "./schema.js";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString =
    process.env.DB_URL || "postgresql://postgres:password@localhost:5432/node-postgres-boilerplate";

// create pool connection
const pool = new pg.Pool({ connectionString });

// create drizzle instance
export const db = drizzle(pool, { schema });
