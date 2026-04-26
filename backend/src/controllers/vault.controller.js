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

    if(!vaultMember) {
        throw new ApiError(500, 'Error creating vaultMember entry');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            vault,
            'Vault created successfully.'
        )
    );

})

const getUserVaults = asyncHandler(async (req, res) => {

    if(!req.user?._id) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    const userId = req.user._id;

    // find vaults created by the user
    const createdVaults = await Vault.find({ createdBy:  userId}).lean();

    // find vault memberships where user is a member
    const membershipRecords = await VaultMember.find({userId}).lean();

    // extract vaultIds from memberships
    const memberVaultIds = membershipRecords.map(record => record.vaultId);

    // extract vault details for the membership vaults
    const memberVaults = await Vault.find({
        _id: { $in: memberVaultIds } // find vaults where ID is in this array
    }).lean();

    // combine both arrays with roles
    const allVaults = [];
    
    // add created vaults with Owner role
    createdVaults.forEach(vault => {
        allVaults.push({
            ...vault,
            role: 'Owner'
        })
    })

    // add member vaults with their specific role
    memberVaults.forEach(vault => {
        const membership = membershipRecords.find(
            record => record.vaultId.toString() === vault._id.toString()
        );
        allVaults.push({
            ...vault,
            role: membership.role
        })
    });

    // return formatted response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            allVaults,
            'Vaults fetched successfully'
        )
    );
})

export {
    createVault,
    getUserVaults
}