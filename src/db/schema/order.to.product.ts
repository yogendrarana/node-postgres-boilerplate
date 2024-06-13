import { relations } from "drizzle-orm";
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";

// import schemans
import { orderSchema } from "./order.js";
import { productSchema } from "./product.js";

// define schema
export const orderToProductSchema = pgTable(
    "order_to_product",

    {
        orderId: uuid("order_id").notNull(),
        productId: uuid("product_id").notNull(),
        quantity: integer("quantity").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },

    (t) => ({
        pk: primaryKey({ columns: [t.orderId, t.productId] }),
    }),
)

// define relationships
export const orderToProductRelations = relations(orderToProductSchema, ({ one }) => ({
    order: one(orderSchema, { fields: [orderToProductSchema.orderId], references: [orderSchema.id] }),
    product: one(productSchema, { fields: [orderToProductSchema.productId], references: [productSchema.id] })
}))


// export types
export type SelectOrderToProduct = InferSelectModel<typeof orderToProductSchema>
export type InsertOrderToProduct = InferInsertModel<typeof orderToProductSchema>