import { APP_ENV } from "../constants/env.js";

// get database url
export function getDbUrl() {
    const env = process.env.NODE_ENV || "development";

    switch (env) {
        case APP_ENV.TEST:
            return (
                process.env.TEST_DB_URL ||
                "postgresql://postgres:password@localhost:5432/node_api_test_db"
            );

        case APP_ENV.PROD:
            return (
                process.env.DB_URL ||
                "postgresql://postgres:password@localhost:5432/node_api_prod_db"
            );

        default:
            return (
                process.env.DB_URL ||
                "postgresql://postgres:password@localhost:5432/node_api_dev_db"
            );
    }
}
