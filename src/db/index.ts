import pg from "pg";
import * as schema from "./schema/index.js";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString =
    process.env.ENV === "production" ?
        process.env.DB_URL :
        'postgresql://postgres:password@localhost:5432/hobby';

// create pool connection
const pool = new pg.Pool({ connectionString });


// create drizzle instance
export const db = drizzle(pool, { schema });