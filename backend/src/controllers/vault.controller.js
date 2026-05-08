import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Vault } from "../models/vault.model.js";
import { VaultMember } from "../models/vaultMember.model.js";
import { Resource } from "../models/resource.model.js";
import { Annotation } from "../models/annotation.model.js";
import { File } from "../models/file.model.js";
import { Invitation } from "../models/invitation.model.js";
import crypto from "crypto";
import { sendEmailInvitation } from "../utils/emailService.js";

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

    const vaultMap = new Map();

    // add created vaults with Owner role
    createdVaults.forEach(vault => {
        vaultMap.set(vault._id.toString(), {
            id: vault._id,
            name: vault.name,
            description: vault.description,
            createdAt: vault.createdAt,
            updatedAt: vault.updatedAt,
            role: 'Owner'
        });
    });

    // add member vaults only if they are not already included as Owner
    memberVaults.forEach(vault => {
        const vaultIdStr = vault._id.toString();
        if (!vaultMap.has(vaultIdStr)) {
            const membership = membershipRecords.find(
                record => record.vaultId.toString() === vaultIdStr
            );
            vaultMap.set(vaultIdStr, {
                id: vault._id,
                name: vault.name,
                description: vault.description,
                createdAt: vault.createdAt,
                updatedAt: vault.updatedAt,
                role: membership?.role || 'Member'
            });
        }
    });

    const allVaults = Array.from(vaultMap.values());

    // get resources of all vaults
    const allVaultsWithResourceCount = await Promise.all(
        allVaults.map(async (vault) => {
        const resourceCount = await Resource.countDocuments({
            vaultId: vault.id
        });

        return {
            ...vault,
            resourceCount: resourceCount
        }
        })
    );
    

    if (allVaults.length === 0) {
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                'No vaults found.'
            )
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            allVaultsWithResourceCount,
            'Vaults fetched successfully'
        )
    );
})

const getVaultById = asyncHandler(async (req, res) => {

    if(!req.user?._id) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    // get vaultId and userId
    const userId = req.user._id;
    const {vaultId} = req.params;

    // get vault from the db
    const vault = await Vault.findById(vaultId);

    if(!vault) {
        throw new ApiError(404, 'Vault not found.');
    }

    // check if the user is authorized or not (owner or member can access)
    const isCreator = vault.createdBy.toString() === userId.toString();
    const membership = await VaultMember.find({
        userId,
        vaultId
    }).lean();    

    if(!isCreator && !membership) { 
        throw new ApiError(403, "You don't have access to this vault.");
    }

    // at this point, user has access

    // finding user role in this vault
    let userRole;
    if(isCreator) {
        userRole = 'Owner';
    } else {
        userRole = membership[0].role;
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

const updateVault = asyncHandler(async (req, res) => {

    if(!req.user?._id) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    // get userId, vaultId and updated details
    const { vaultId } = req.params;
    const userId = req.user._id;
    const {name, description} = req.body;

    // validate data
    if(!name || !name.trim()) {
        throw new ApiError(400, 'Vault name is required.');
    }

    // find vault
    const vault = await Vault.findById(vaultId);

    if(!vault) {
        throw new ApiError(404, 'Vault not found.');
    }

    // Authorize user => Only owner can update the vault
    const isCreator = vault.createdBy.toString() === userId.toString();

    if(!isCreator) {
        throw new ApiError(403, "Only vault owner can update vault.");
    }
    
    // at this point -> user is owner; update fields
    vault.name = name.trim();
    if(description !== undefined || description.trim().length !== 0) {
        vault.description = description.trim();
    }
    vault.updatedAt = new Date();

    await vault.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            vault,
            'Vault updated successfully.'
        )
    );
})

const deleteVault = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const {vaultId} = req.params;

    const vault = await Vault.findById(vaultId);
    if(!vault) {
        throw new ApiError(404, 'Vault not found.');
    }

    // authorize user
    const isCreator = vault.createdBy.toString() === userId.toString();
    if(!isCreator) {
        throw new ApiError(403, "Only vault owner can delete vault.");
    }

    // Cascade delete
    const resources = await Resource.find({vaultId});

    // deleting annotations and files of each resource
    for(const resource of resources) {
        await Annotation.deleteMany({resourceId: resource._id});
        await File.deleteMany({resourceId: resource._id});
    }

    // deleting all resources
    await Resource.deleteMany({vaultId});

    // deleting all vault memberships
    await VaultMember.deleteMany({vaultId});

    // finally, delete the vault
    await Vault.deleteOne({ _id: vaultId });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {},
            'Vault deleted successfully.'
        )
    );
})

const inviteVaultMember = asyncHandler(async (req, res) => {
    
    const userId = req.user._id;
    const {invitedEmail, role} = req.body;
    const {vaultId} = req.params;

    // validation
    if(!invitedEmail || (typeof invitedEmail === 'string' && !invitedEmail.trim())){
        throw new ApiError(400, 'Email is required.');
    }

    if(!role || !['owner', 'contributor', 'viewer'].includes(role.toLowerCase())) {
        throw new ApiError(400, 'Valid role is required.');
    }

    const vault = await Vault.findById(vaultId);
    if(!vault) {
        throw new ApiError(404, 'Vault not found');
    }

    // check if user is vault owner
    const isVaultOwner = vault.createdBy.toString() === userId.toString();
    if(!isVaultOwner) {
        throw new ApiError(403, 'Only vault owner can invite members.');
    }

    // check if email is already a member
    const existingMember = await User.findOne({email: invitedEmail})
    if(existingMember) {
        const isMember = await VaultMember.findOne({
            userId: existingMember._id,
            vaultId
        });

        if(isMember) {
            throw new ApiError(400, 'User is already a member of this vault.')
        }
    };

    // check if invitation already exists
    const existingInvite = await Invitation.findOne({
        invitedEmail,
        vaultId,
        status: 'pending'
    });
    if(existingInvite) {
        throw new ApiError(400, 'Invitation already sent to this email.');
    }

    // generate new token
    const token = crypto.randomBytes(32).toString('hex');

    // create invitation record
    const invitation = await Invitation.create({
        vaultId,
        invitedEmail,
        role,
        invitedBy: userId,
        token,
        status: 'pending'
    });

    // send email
    const invitationLink = `${process.env.FRONTEND_URL}/accept-invite/${token}`;

    await sendEmailInvitation(
        invitedEmail,
        vault.name,
        req.user.username,
        invitationLink
    );

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                id: invitation._id,
                invitedEmail: invitation.invitedEmail,
                role: invitation.role,
                status: invitation.status,
                expiresAt: invitation.expiresAt
            },
            `Invitation sent to ${invitedEmail}`
        )
    )
})

const acceptInvitation = asyncHandler(async (req, res) => {

    const {token} = req.params;
    const userId = req.user._id;

    // find invitation by token
    const invitation = await Invitation.findOne({token});
    if(!invitation) {
        throw new ApiError(404, 'Invalid invitation link');
    }

    // check if expired
    if(new Date() > invitation.expiresAt) {
        // delete record
        await Invitation.deleteOne({ _id: invitation._id });
        throw new ApiError(400, 'Invitation has expired');
    }

    // check if already accepted
    if(invitation.status !== 'pending') {
        throw new ApiError(400, `Invitation has already been ${invitation.status}`);
    }

    // verify that the logged-in user's email matches
    const user = await User.findById(userId);
    if(user.email !== invitation.invitedEmail) {
        throw new ApiError(403, 'This invitation is for a different email address');
    }

    // create vault member entry
    const vaultMember = await VaultMember.create({
        userId,
        vaultId: invitation.vaultId,
        role: invitation.role,
        addedAt: new Date()
    });

    // update status of invitation
    invitation.status = 'accepted';
    await invitation.save();

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                vaultId: invitation.vaultId,
                role: invitation.role
            },
            'Invitation accepted! You are now a member of the vault'
        )
    );

})

export {
    createVault,
    getUserVaults,
    getVaultById,
    updateVault,
    deleteVault,
    inviteVaultMember,
    acceptInvitation
}