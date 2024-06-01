import express from "express";
const router = express.Router();
// import controllers and middlewares
import * as roleMiddleware from "../middlewares/roleMiddleware.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import * as adminController from "../controllers/adminController.js";
// define routes
router.route('/admin/dashboard').get(authMiddleware.verifyAccessToken, roleMiddleware.verifyAdminRole, adminController.getDashboardData);
// export 
export default router;
