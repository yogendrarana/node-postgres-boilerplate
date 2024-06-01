import { eq } from "drizzle-orm"
import { db } from "../config/db/db.js"
import { SelectUser, userSchema } from "../config/db/schema/user.js"

export const getUserByEmail = async (email: string): Promise<SelectUser[]> => {
    return await db.select().from(userSchema).where(eq(userSchema.email, email))
}