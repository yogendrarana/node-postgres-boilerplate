import express from "express";
const router = express.Router();
// import controllers and middlewares
import * as authControllers from "../controllers/authController.js";
// define routes
router.route('/auth/register').post(authControllers.registerUser);
router.route('/auth/login').post(authControllers.loginUser);
router.route('/auth/logout').get(authControllers.logoutUser);
// export router
export default router;
