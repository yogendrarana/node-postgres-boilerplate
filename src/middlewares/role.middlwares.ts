import type { NextFunction, Response } from "express";
import ErrorHandler from "../handlers/errorHandler.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";

export const verifyAdminRole = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        return next(
            new ErrorHandler(403, "User does not have admin role to access this resource.")
        );
    }

    next();
};
