import { Router } from "express";
import { deleteResource, getResourceById, updateResource } from "../controllers/resource.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:resourceId")
.get(verifyJWT, getResourceById)
.patch(verifyJWT, updateResource)
.delete(verifyJWT, deleteResource);

export default router;
