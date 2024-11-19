import pg from "pg";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { afterAll, afterEach, beforeAll } from "vitest";
import { migrate } from "drizzle-orm/postgres-js/migrator";

// create drizzle instance for test database
const testDbUrl = process.env.TEST_DB_URL;
export const testDbPool = new pg.Pool({ connectionString: testDbUrl });
export const testDb = drizzle(testDbPool, { schema });

beforeAll(async () => {
    // Run migrations on the test database
    try {
        await migrate(testDb, { migrationsFolder: "./drizzle" });
    } catch (error) {
        console.error("Migration failed:", error);
        throw error;
    }
});

afterEach(async () => {
    // Clean up all tables after each test
    const tables = Object.values(schema)
        .filter((table) => "name" in table)
        .map((table) => table.name);

    for (const table of tables) {
        await testDb.execute(sql`TRUNCATE TABLE ${table} CASCADE`);
    }
});

afterAll(async () => {
    await testDbPool.end();
});
