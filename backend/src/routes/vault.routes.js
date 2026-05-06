// import Router from "express";
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createVault, deleteVault, getUserVaults, getVaultById, updateVault } from "../controllers/vault.controller.js";
import { createResource, getVaultResources } from "../controllers/resource.controller.js";
import { addMember, getVaultMembers, removeMember, updateMemberRole } from "../controllers/member.controller.js";

const router = Router();

// vault endpoints
router.route('').post(
    verifyJWT,
    createVault
)

router.route('').get(
    verifyJWT,
    getUserVaults
)

router.route('/:vaultId').get(
    verifyJWT,
    getVaultById
)

router.route('/:vaultId').put(
    verifyJWT,
    updateVault
)

router.route('/:vaultId').delete(
    verifyJWT,
    deleteVault
)

// resource endpoints
router.route('/:vaultId/resources').post(
    verifyJWT,
    upload.single('file'),
    createResource
)

router.route('/:vaultId/resources').get(
    verifyJWT,
    getVaultResources
)

// vault collaboration endpoints
router.route('/:vaultId/members').post(
    verifyJWT,
    addMember
)

router.route('/:vaultId/members').get(
    verifyJWT,
    getVaultMembers
)

router.route('/:vaultId/members/:memberId').patch(
    verifyJWT,
    updateMemberRole
)

router.route('/:vaultId/members/:memberId').delete(
    verifyJWT,
    removeMember
)


export default router;