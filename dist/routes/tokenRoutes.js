import express from "express";
const router = express.Router();
// import controllers and middlewares
import * as tokenController from "../controllers/tokenController.js";
// define routes
router.route('/token/new-access-token').get(tokenController.issuseNewAccessToken);
// export
export default router;
