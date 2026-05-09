import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { acceptInvitation, cancelInvitation, getPendingInvitations, getVaultInvitations, inviteVaultMember, rejectInvitation } from "../controllers/vault.controller.js";


const router = Router();

router.route('/vaults/:vaultId/invite').post(
    verifyJWT,
    inviteVaultMember
)

router.route('/invitations/:token/accept').post(
    verifyJWT,
    acceptInvitation
);

router.route('/invitations/:token/reject').post(
    verifyJWT,
    rejectInvitation
);

router.route('/:vaultId/invitations/:invitationId').delete(
    verifyJWT,
    cancelInvitation
)

router.route('/:vaultId/invitations').get(
    verifyJWT,
    getVaultInvitations
)

router.route('/invitations/pending').get(
    verifyJWT,
    getPendingInvitations
)

export default router