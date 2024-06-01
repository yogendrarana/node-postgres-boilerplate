import { asyncHandler } from "../util/asyncHandler.js";
export const getDashboardData = asyncHandler(async (req, res, next) => {
    console.log(req.user);
    res.status(200).json({
        success: true,
        message: "Admin dashboard data",
        data: {
            users: 10,
            products: 20,
            orders: 30
        }
    });
});
