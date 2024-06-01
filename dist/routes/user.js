import express from "express";
const router = express.Router();
// import controllers and middlewares
import * as authControllers from "../controllers/user.js";
// define routes
router.route('/auth/register').post(authControllers.registerUser);
router.route('/auth/login').post(authControllers.loginUser);
router.route('/auth/logout').get(authControllers.logoutUser);
router.route('/user').get((req, res) => res.status(200).send('User route'));
// export router
export default router;
