import type { Config } from 'drizzle-kit';


const connectionString =
    process.env.ENV === "production" ?
        process.env.DB_URL :
        'postgresql://postgres:password@localhost:5432/hobby';


export default {
    dialect: "postgresql",
    schema: "./dist/config/db/schema/*",
    out: "./migrations",
    dbCredentials: {
        url: connectionString,
    }
} as Config;