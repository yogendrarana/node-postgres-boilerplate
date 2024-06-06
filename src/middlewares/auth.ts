import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../config/db/db.js";
import ErrorHandler from "../handlers/errorHandler.js";
import { userSchema } from "../config/db/schema/user.js";
import { NextFunction, Request, Response } from "express";


// Define a custom interface that extends the Express Request interface
interface CustomRequest extends Request {
    user?: any;
}


export const verifyAccessToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authoriztion;
    if (!authHeader || !(authHeader as string).startsWith('Bearer ')) {
        throw new ErrorHandler(401, "Bearer token is not available!");
    }

    const accessToken = (authHeader as string).split(' ')[1];
    if (!accessToken) {
        return next(new ErrorHandler(401, "Access token is not available!"));
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, async (err, decoded) => {

        // handle error
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new ErrorHandler(401, "Access token expired!"));
            } else if (err.name === 'JsonWebTokenError') {
                return next(new ErrorHandler(401, "Invalid access token!"));
            } else {
                return next(new ErrorHandler(401, "Unauthorized!"));
            }
        }

        // get user associated with access token
        const userId = (decoded as any).id;
        const user = await db.query.userSchema.findFirst({ where: eq(userSchema.id, userId) })
        if (!user) {
            return next(new ErrorHandler(401, "User associated with the accesss token does not exist!"));
        }

        // set user in request
        req.user = user;

        // call next middleware
        next();
    });
}