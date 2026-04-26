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

const getVaultById = asyncHandler(async (req, res) => {

    if(!req.user?._id) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    // get vaultId and userId
    const userId = req.user.id
    const {vaultId} = req.params;

    // get vault from the db
    const vault = await Vault.findById(vaultId);

    if(!vault) {
        throw new ApiError(404, 'Vault not found.');
    }

    // check if the user is authorized or not (owner or member can access)
    const isCreator = vault.createdBy.toString() === userId;
    const membership = await VaultMember.find({
        userId,
        vaultId
    }).lean();

    if(!isCreator || !membership) {
        throw new ApiError(403, "You don't have access to this vault.");
    }

    // at this point, user has access

    // finding user role in this vault
    let userRole;
    if(isCreator) {
        userRole = 'Owner';
    } else {
        userRole = membership.role;
    }

    // find details of all members of this vault
    const members = await VaultMember
        .find({ vaultId })
        .populate('userId', 'username email') // JOIN with Users
        .lean();
    
    
    // format response
    const formattedMembers = members.map(member => ({
        id: member._id,
        userId: member.userId._id,
        username: member.userId.username,
        email: member.userId.email,
        role: member.role,
        addedAt: member.addedAt
    }));

    const responseData = {
        id: vault._id,
        name: vault.name,
        description: vault.description,
        createdBy: vault.createdBy,
        createdAt: vault.createdAt,
        updatedAt: vault.updatedAt,
        userRole: userRole,
        members: formattedMembers
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            responseData,
            'Vault fetched successfully.'
        )
    );
})

export {
    createVault,
    getUserVaults
}