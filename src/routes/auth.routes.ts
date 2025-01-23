import express from "express";
const router = express.Router();
import passport from "passport";
import * as authControllers from "../controllers/auth.controllers.js";

// define routes
router.route("/auth/login").post(authControllers.loginUser);
router.route("/auth/logout").get(authControllers.logoutUser);
router.route("/auth/register").post(authControllers.registerUser);
router.route("/auth/refresh").get(authControllers.refreshAccessToken);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    authControllers.googleAuthCallback
);

// export router
export default router;
