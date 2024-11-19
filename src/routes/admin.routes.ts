import express from "express";
const router = express.Router();

// import controllers and middlewares
import * as roleMiddleware from "../middlewares/role.middlwares.js";
import * as authMiddleware from "../middlewares/auth.middlewares.js";
import * as adminController from "../controllers/admin.controllers.js";

// define routes
router
    .route("/admin/dashboard")
    .get(
        authMiddleware.verifyAccessToken,
        roleMiddleware.verifyAdminRole,
        adminController.getDashboardData
    );

// export
export default router;
