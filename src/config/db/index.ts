import { userSchema, userRelations } from "./schema/user.js";
import { orderSchema, orderRelations } from "./schema/order.js";
import { productSchema, productRelations } from "./schema/product.js";
import { orderToProductSchema, orderToProductRelations } from "./schema/order.to.product.js";
import { tokenRelations, tokenSchema } from "./schema/token.js";


export const schemas = {
    userSchema,
    userRelations,
    orderSchema,
    orderRelations,
    productSchema,
    productRelations,
    tokenSchema,
    tokenRelations,
    orderToProductSchema,
    orderToProductRelations,
}