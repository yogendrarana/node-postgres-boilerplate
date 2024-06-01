import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
// import schemas
import { userSchema } from "./schema/user.js";
import { orderSchema } from "./schema/order.js";
import { productSchema } from "./schema/product.js";
import { orderToProductSchema } from "./schema/order.to.product.js";
import { refreshTokenSchema } from "./schema/token.js";
// import relations
import { userRelations } from "./schema/user.js";
import { orderRelations } from "./schema/order.js";
import { productRelations } from "./schema/product.js";
import { orderToProductRelations } from "./schema/order.to.product.js";
import { refreshTokenRelations } from "./schema/token.js";
// create pool connection
const pool = new pg.Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "hobby",
});
// create drizzle instance
export const db = drizzle(pool, {
    schema: {
        userSchema,
        userRelations,
        refreshTokenSchema,
        refreshTokenRelations,
        orderSchema,
        orderRelations,
        productSchema,
        productRelations,
        orderToProductSchema,
        orderToProductRelations,
    },
});
