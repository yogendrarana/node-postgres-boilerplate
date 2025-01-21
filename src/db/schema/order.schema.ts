import { relations } from "drizzle-orm";
import { userSchema } from "./user.schema.js";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// schema definition
export const orderSchema = pgTable(
    "order",

    {
        id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
        customerId: integer("customer_id").notNull(),
        totalAmount: numeric("total_amount").notNull(),
        status: text("status").notNull(),
        orderItems: jsonb("order_items").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull()
    }
);

// define relationships
export const orderRelations = relations(orderSchema, ({ one }) => ({
    customer: one(userSchema, { fields: [orderSchema.customerId], references: [userSchema.id] })
}));

// export types
export type SelectableOrder = InferSelectModel<typeof orderSchema>;
export type InsertableOrder = InferInsertModel<typeof orderSchema>;
