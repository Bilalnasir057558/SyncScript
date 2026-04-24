import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Vault } from "../models/vault.model.js";
import { VaultMember } from "../models/vaultMember.model.js";

const createVault = asyncHandler(async (req, res) => {

    const userId = req.user?._id;

    if(!userId) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    // get vault details
    const {name, description} = req.body;

    // validate
    if(!name || !name?.trim()) {
        throw new ApiError(400, 'Vault name is required.');
    }

    // create vault entry in db
    const vault = await Vault.create({
        name,
        description: description || "",
        createdBy: userId
    })

    if(!vault) {
        throw new ApiError(500, 'Something went wrong while creating a vault.');
    }

    // auto create vaultMember entry
    const vaultMember = await VaultMember.create({
        userId,
        vaultId: vault._id,
        role: 'Owner'
    });

    if(!vaultMember) {
        throw new ApiError(500, 'Error creating vaultMember entry');
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            vault,
            'Vault created successfully.'
        )
    );

})

export {
    createVault
}