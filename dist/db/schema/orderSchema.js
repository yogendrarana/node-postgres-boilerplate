import { relations } from "drizzle-orm";
import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
// import schemas
import { userSchema } from "./userSchema.js";
import { orderToProductSchema } from "./orderToProduct.js";
// define schema
export const orderSchema = pgTable("order", {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    customerId: integer("customer_id").notNull(),
    totalAmount: numeric("total_amount").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// define relationships
export const orderRelations = relations(orderSchema, ({ many, one }) => ({
    customer: one(userSchema, { fields: [orderSchema.customerId], references: [userSchema.id] }),
    ordersToProducts: many(orderToProductSchema)
}));
