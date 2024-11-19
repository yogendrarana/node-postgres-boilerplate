import express from "express"
const router = express.Router();

// import controllers and middlewares
import * as authControllers from "../controllers/auth.controllers.js";

// define routes
router.route('/auth/login').post(authControllers.loginUser);
router.route('/auth/logout').get(authControllers.logoutUser);
router.route('/auth/register').post(authControllers.registerUser);

// export router
export default router;