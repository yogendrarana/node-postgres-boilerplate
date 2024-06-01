import pg from "pg";
import { schemas } from "./index.js";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString =
    process.env.ENV === "production" ?
        process.env.DATABASE_URL :
        'postgresql://postgres:password@localhost:5432/hobby';

// create pool connection
const pool = new pg.Pool({ connectionString });


// create drizzle instance
export const db = drizzle(pool, { schema: schemas });