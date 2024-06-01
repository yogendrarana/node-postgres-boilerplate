import { NextFunction, Response } from "express";
import { asyncHandler } from "../util/asyncHandler.js";
import { AuthenticatedRequest } from "../types/index.js";

export const getDashboardData = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.user)

    res.status(200).json({
        success: true,
        message: "Admin dashboard data",
        data: {
            users: 10,
            products: 20,
            orders: 30
        }
    })
})