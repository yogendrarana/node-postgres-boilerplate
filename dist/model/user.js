import { db } from "../config/db/db.js";
import { userSchema } from "../config/db/schema/user.js";
class UserModel {
    constructor(_token) {
        this._token = _token;
    }
    // create user
    async insertUser(user) {
        await db.insert(userSchema).values(user).returning();
    }
}
