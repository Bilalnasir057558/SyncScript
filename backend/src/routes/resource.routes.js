import { Router } from "express";
import { createResource, getVaultResources } from "../controllers/resource.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Route: /api/v1/resources/:vaultId
// verifyJWT: ensures user is logged in
// upload.single("file"): uses multer to catch the file upload

router.route("/:vaultId")
.post(verifyJWT, upload.single("file"), createResource)
.get(verifyJWT, getVaultResources);

export default router;