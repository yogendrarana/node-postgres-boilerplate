import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../config/db/db.js";
import ErrorHandler from "../util/errorHandler.js";
import { userSchema } from "../config/db/schema/user.js";
export const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authoriztion;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ErrorHandler(401, "Bearer token is not available!");
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
        return next(new ErrorHandler(401, "Access token is not available!"));
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        // handle error
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new ErrorHandler(401, "Access token expired!"));
            }
            else if (err.name === 'JsonWebTokenError') {
                return next(new ErrorHandler(401, "Invalid access token!"));
            }
            else {
                return next(new ErrorHandler(401, "Unauthorized!"));
            }
        }
        // get user associated with access token
        const userId = decoded.id;
        const user = await db.query.userSchema.findFirst({ where: eq(userSchema.id, userId) });
        if (!user) {
            return next(new ErrorHandler(401, "User associated with the accesss token does not exist!"));
        }
        // set user in request
        req.user = user;
        // call next middleware
        next();
    });
};
