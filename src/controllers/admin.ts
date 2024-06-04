import { Response } from "express";
import { asyncHandler } from "../handlers/asyncHandler.js";
import { AuthenticatedRequest } from "../types/index.js";

export const getDashboardData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
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