import Router from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { createVault, deleteVault, getUserVaults, getVaultById, updateVault } from "../controllers/vault.controller.js";
import { addMember } from "../controllers/member.controller.js";

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

// vault collaboration endpoints
router.route('/:vaultId/members').post(
    verifyJWT,
    addMember
)


export default router;