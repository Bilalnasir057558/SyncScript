import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Vault } from "../models/vault.model.js";
import { VaultMember } from "../models/vaultMember.model.js";
import { User } from "../models/user.model.js";

const addMember = asyncHandler(async (req, res) => {

    if(req.user?._id) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    // get data
    const ownerId = req.user._id;
    const vaultId = req.params;
    const { username, role } = req.body;

    // validate data from the frontend
    if([username, role].some(field => 
        !field || (typeof field === "string" && !field.trim())
    )) {
        throw new ApiError(400, 'All fields are required.');
    }

    // check user exists or not
    const user = await User.findOne({
        username: username.toLowerCase()
    });

    if(!user) {
        throw new ApiError(404, `User with username ${username} does not exist.`);
    }

    // check if vault exists or not
    const vault = await Vault.findById(vaultId);

    if(!vault) {
        throw new ApiError(404, 'Vault not found.');
    }

    // check if user is an owner or not
    const isCreator = vault.createdBy.toString() === ownerId.toString();

    if(!isCreator) {
        throw new ApiError(409, 'Only vault owner can add members.');
    }

    // at this point, user is owner
    // create membership with specific role
    const membership = await VaultMember.create({
        userId: user._id,
        vaultId,
        role: role.charAt(0).toUpperCase() + role.slice(1)
    });

    if(!membership) {
        throw new ApiError(500, 'Something went wrong while adding a member.');
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            membership,
            'Member added successfully.'
        )
    );
});


export {
    addMember
}