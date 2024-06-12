import express from "express"
const router = express.Router();

// import controllers and middlewares
import * as userControllers from "../controllers/user.js";

// define routes
router.route('/users').post(userControllers.getUsers);

// export router
export default router;