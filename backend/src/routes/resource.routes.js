import { Router } from "express";
import { getResourceById, updateResource } from "../controllers/resource.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:resourceId")
.get(verifyJWT, getResourceById)
.patch(verifyJWT, updateResource);

export default router;
