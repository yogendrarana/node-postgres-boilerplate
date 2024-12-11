import pg from "pg";
import dotenv from "dotenv";
import path from "node:path";
import { afterAll, beforeAll } from "vitest";
import * as schema from "../src/db/schema.js";
import { getTableName, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { validateTestDatabase } from "../src/service/db.services.js";


// load env variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Get and validate database URL
const testDbUrl =
    process.env.TEST_DB_URL || "postgresql://postgres:password@localhost:5432/node_api_test_db";
validateTestDatabase(testDbUrl);

// create database connection
export const testDbPool = new pg.Pool({ connectionString: testDbUrl });
export const testDb = drizzle(testDbPool, { schema });

beforeAll(async () => {
    try {
        // Log the environment we're running in
        console.log(
            `🧪 Starting tests in environment: ${
                process.env.NODE_ENV || "test"
            } 📊 Database: ${testDbUrl} `
        );

        // Run migrations on the test database
        await migrate(testDb, { migrationsFolder: "drizzle" });
    } catch (error: any) {
        console.error("❌ Migration failed:", error.message);
        process.exit(1);
    }
});

afterAll(async () => {
    await testDbPool.end();
    console.log("✓ Database connection closed");
});

// helper function to truncate tables
export const truncateTables = async (tableNames?: string[]) => {
    const allTableNames = Object.values(schema)
        .map((item) => getTableName(item as any))
        .filter((name): name is string => name !== undefined);

    const tablesToTruncate = tableNames || allTableNames;

    for (const tableName of tablesToTruncate) {
        try {
            await testDb.execute(sql`TRUNCATE TABLE ${sql.identifier(tableName)} CASCADE`);
        } catch (error) {
            console.error(`Failed to truncate table ${tableName}:`, error);
        }
    }
};
