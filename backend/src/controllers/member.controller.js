import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vault } from "../models/vault.model.js";
import { VaultMember } from "../models/vaultMember.model.js";
import { User } from "../models/user.model.js";

const addMember = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized request.");
  }

  // get data
  const ownerId = req.user._id;
  const { vaultId } = req.params;
  const { username, role } = req.body;

  // validate data from the frontend
  if (
    [username, role].some(
      (field) => !field || (typeof field === "string" && !field.trim()),
    )
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  if (!["contributor", "viewer"].includes(role.toLowerCase())) {
    throw new ApiError(400, "Invalid role. Must be Contributor or Viewer.");
  }

  // check user exists or not
  const user = await User.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!user) {
    throw new ApiError(404, `User with username ${username} does not exist.`);
  }

  // can't add yourself
  if (ownerId.toString() === user._id.toString()) {
    throw new ApiError(400, "You cannot add yourself as a member.");
  }

  // check if vault exists or not
  const vault = await Vault.findById({
    _id: vaultId,
  }).lean();

  if (!vault) {
    throw new ApiError(404, "Vault not found.");
  }

  // check if member exists or not
  const memberExist = await VaultMember.findOne({
    userId: user._id,
    vaultId,
  });

  if (memberExist) {
    throw new ApiError(409, "Member already exists.");
  }

  // check if user is an owner or not
  const isCreator = vault.createdBy.toString() === ownerId.toString();

  if (!isCreator) {
    throw new ApiError(403, "Only vault owner can add members.");
  }

  // create membership with specific role
  const membership = await VaultMember.create({
    userId: user._id,
    vaultId,
    role: role.charAt(0).toUpperCase() + role.slice(1),
  });

  if (!membership) {
    throw new ApiError(500, "Something went wrong while adding a member.");
  }

  // populate user details for response
  await membership.populate("userId", "username email");

  const responseData = {
    id: membership._id,
    userId: membership.userId._id,
    username: membership.userId.username,
    email: membership.userId.email,
    role: membership.role,
    addedAt: membership.addedAt,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Member added successfully."));
});

const getVaultMembers = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized access.");
  }

  const userId = req.user._id;
  const { vaultId } = req.params;

  // fetch vault and join with User to get owner details
  const vault = await Vault.findById({
    _id: vaultId,
  }).populate("createdBy", "username email");

  if (!vault) {
    throw new ApiError(404, "Vault not found.");
  }

  // only member can view member list
  // check if user is a member or not
  const isCreator = vault.createdBy.toString() === userId.toString();
  const isMember = await VaultMember.find({
    userId,
    vaultId,
  }).lean();

  if (!isCreator && !isMember) {
    throw new ApiError(403, "Only vault members can view member list.");
  }

  // fetch members of the vault
  const members = await VaultMember.find({ vaultId })
    .populate("userId", "username email")
    .lean();
    
  // combine owner and members in a single list
  const allMembers = [
    // owner as first item
    {
      id: vault.createdBy._id,
      userId: vault.createdBy._id,
      username: vault.createdBy.username,
      email: vault.createdBy.email,
      role: "Owner",
    },
    // All members

    ...members.map((member) => ({
      id: member._id,
      userId: member.userId._id,
      username: member.userId.username,
      email: member.userId.email,
      role: member.role,
    })),
  ];

  return res
    .status(200)
    .json(new ApiResponse(200, allMembers, "Members fetched successfully."));
});

const updateMemberRole = asyncHandler(async (req, res) => {

  if(!req.user?._id) {
    throw new ApiError(401, 'Unauthorized request.');
  }

  // get data
  const userId = req.user._id;
  const {vaultId, memberId} = req.params;
  const {role} = req.body;

  // check if role exist or not
  if(!role || (typeof role === "string" && !role.trim())) {
    throw new ApiError(400, 'Role is required.');
  }

  // validate role
  if(!['contributor', 'viewer'].includes(role.toLowerCase())) {
    throw new ApiError(401, 'Invalid role. Must be Contributor or Viewer.');
  }

  // validate member
  const membership = await VaultMember.findOne({
    userId: memberId,
    vaultId
  });

  if(!membership) {
    throw new ApiError(401, 'Invalid memberId.');
  }

  // validate vault
  const vault = await Vault.findById({
    _id: vaultId
  }).lean();

  if(!vault) {
    throw new ApiError(404, 'Vault not found.');
  }

  // only owner can change the role
  const isCreator = vault.createdBy.toString() === userId.toString();
  if(!isCreator) {
    throw new ApiError(403, "Only owner can update the member's role");
  }

  // update the role
  membership.role = role.charAt(0).toUpperCase() + role.slice(1);

  await membership.save();

  // get details of member from the User db
  await membership.populate('userId', 'username email');

  const responseData = {
    id: membership._id,
    userId: membership.userId._id,
    username: membership.userId.username,
    email: membership.userId.email,
    role: membership.role,
    addedAt: membership.addedAt
  };

  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      responseData,
      'Member role updated successfully.'
    )
  );
}) 

const removeMember = asyncHandler(async (req, res) => {
    if(!req.user?._id) {
    throw new ApiError(401, 'Unauthorized request.');
  }

  // get data
  const userId = req.user._id;
  const {vaultId, memberId} = req.params;

  // validate member
  const membership = await VaultMember.findOne({
    userId: memberId,
    vaultId
  });

  if(!membership) {
    throw new ApiError(401, 'Invalid memberId.');
  }

  // validate vault
  const vault = await Vault.findById({
    _id: vaultId
  }).lean();

  if(!vault) {
    throw new ApiError(404, 'Vault not found.');
  }

  // only owner can remove the member
  const isCreator = vault.createdBy.toString() === userId.toString();
  if(!isCreator) {
    throw new ApiError(403, "Only owner can update the member's role");
  }

  // delete db document
  await VaultMember.findOneAndDelete({
    userId: memberId,
    vaultId
  }).lean();

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      'Member removed successfully'
    )
  );
})

export { addMember, getVaultMembers, updateMemberRole, removeMember };
