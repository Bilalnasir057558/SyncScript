import Router from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createVault } from "../controllers/vault.controller.js";

const router = Router();

router.route('').post(
    verifyJWT,
    createVault
)

export default router;