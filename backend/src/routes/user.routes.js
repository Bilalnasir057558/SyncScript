import Router from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

// secure route -> needs login
router.route('/logout').post(
    verifyJWT,
    logoutUser
)

router.route('/refresh').post(refreshAccessToken);


export default router;