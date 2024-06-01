import { relations } from "drizzle-orm";
import { decimal, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
// import schemas
import { orderToProductSchema } from "./orderToProduct.js";
// schema definition
export const productSchema = pgTable("product", {
    id: uuid("id").primaryKey().unique().notNull().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    stock: integer("stock").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
// define relationships
export const productRelations = relations(productSchema, ({ many }) => ({
    ordersToProducts: many(orderToProductSchema)
}));
