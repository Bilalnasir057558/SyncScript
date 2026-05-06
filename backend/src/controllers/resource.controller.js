import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Resource } from "../models/resource.model.js";
import { File } from "../models/file.model.js"; // Import the separate File model
import { VaultMember } from "../models/vaultMember.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vault } from "../models/vault.model.js";

const formatFile = (file) => {
    if (!file) return null;
    return {
        fileName: file.fileName,
        filePath: file.filePath,
        uploadedAt: file.uploadedAt
    };
};

const formatResource = (resource) => {
    const files = Array.isArray(resource.file)
        ? resource.file.map(formatFile).filter(Boolean)
        : [];

    return {
        id: resource._id,
        title: resource.title,
        url: resource.url,
        vaultId: resource.vaultId,
        createdBy: resource.createdBy?._id || resource.createdBy,
        createdByUsername: resource.createdBy?.username || undefined,
        createdByFullName: resource.createdBy?.fullName || undefined,
        files,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt
    };
};

const createResource = asyncHandler(async (req, res) => {
    const { vaultId } = req.params;
    const { title, url } = req.body;

    if (!title) throw new ApiError(400, "Title is required for a resource");

    // 1. Authorization: Check if user is Owner or Contributor
    const owner = await Vault.findOne({
        _id: vaultId,
        createdBy: req.user._id
    });

    if (!owner) {
        const member = await VaultMember.findOne({
            vaultId,
            userId: req.user._id,
            role: "Contributor"
        });

        if (!member) {
            throw new ApiError(403, "Access denied. You cannot add resources to this vault.");
        }
    }

    if (!title || !title.trim()) {
        throw new ApiError(400, "Title is required for a resource.");
    }
    if (url !== undefined && url !== null && !String(url).trim()) {
        throw new ApiError(400, "URL cannot be empty or whitespace.");
    }

    // 2. Create the Resource entry first
    const resource = await Resource.create({
        title: title.trim(),
        url: url ? url.trim() : undefined,
        vaultId,
        createdBy: req.user._id
    });

    // 3. Handle File Upload (if Multer caught a file)
    let fileEntry = null;
    if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if (!cloudinaryResponse) {
            throw new ApiError(500, "File upload failed at the storage server.");
        }

        // Create the separate File record
        fileEntry = await File.create({
            fileName: req.file.originalname,
            filePath: cloudinaryResponse.url,
            resourceId: resource._id,
            userId: req.user._id
        });

        // Link the File ID back to the Resource (if your resource model has the array)
        resource.file.push(fileEntry._id);
        await resource.save();
    }

    const responsePayload = {
        id: resource._id,
        title: resource.title,
        url: resource.url,
        vaultId: resource.vaultId,
        createdBy: resource.createdBy,
        files: fileEntry ? [{ fileName: fileEntry.fileName, filePath: fileEntry.filePath }] : [],
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt
    };

    return res.status(201).json(
        new ApiResponse(
            201,
            responsePayload,
            "Resource created successfully"
        )
    );
});

export { createResource };

const getVaultResources = asyncHandler(async (req, res) => {
    const { vaultId } = req.params;

    // 1. Check if the user is the vault owner or a member of the vault
    const vault = await Vault.findOne({
        _id: vaultId,
        createdBy: req.user._id
    });

    let isAuthorized = !!vault; // User is authorized if they're the creator

    if (!isAuthorized) {
        // If not the owner, check if they're a member (Contributor or Viewer)
        const member = await VaultMember.findOne({
            vaultId,
            userId: req.user._id
        });
        isAuthorized = !!member;
    }

    if (!isAuthorized) {
        throw new ApiError(403, "You do not have permission to view this vault's resources");
    }

    // 2. Fetch resources and "Populate" the related data
    const resources = await Resource.find({ vaultId })
        .populate("createdBy", "username fullName email") // Get creator details from User model
        .populate("file") // Swap file IDs for actual File documents
        .sort({ createdAt: -1 }); // Show newest first

    const responseData = resources.map(formatResource);

    return res.status(200).json(
        new ApiResponse(200, responseData, "Resources retrieved successfully")
    );
});

export { getVaultResources };

const getResourceById = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;

    // 1. Find the resource first to get its vaultId
    const resource = await Resource.findById(resourceId)
        .populate("createdBy", "fullName username") // Get creator info
        .populate("file"); // Get associated file details

    if (!resource) {
        throw new ApiError(404, "Resource not found in the sanctuary.");
    }

    // 2. Authorization: Check if user has access to the parent vault
    const membership = await VaultMember.findOne({
        vaultId: resource.vaultId,
        userId: req.user._id
    });

    if (!membership) {
        throw new ApiError(403, "You do not have permission to view this resource.");
    }

    // 3. Format the response
    return res.status(200).json(
        new ApiResponse(200, formatResource(resource), "Resource details retrieved successfully")
    );
});

export { getResourceById };

const updateResource = asyncHandler(async (req, res) => {
    const { resourceId } = req.params;
    const { title, url } = req.body;

    // 1. Find the resource
    const resource = await Resource.findById(resourceId);
    if (!resource) {
        throw new ApiError(404, "Resource not found.");
    }

    // 2. Authorization Check
    // Check if user is the Creator
    const isCreator = resource.createdBy.toString() === req.user._id.toString();

    // Check if user is the Vault Owner
    const vault = await Vault.findById(resource.vaultId);
    const isVaultOwner = vault?.createdBy.toString() === req.user._id.toString();

    if (!isCreator && !isVaultOwner) {
        throw new ApiError(403, "Access denied. Only the creator or vault owner can edit this.");
    }

    // 3. Validate and perform the update
    if (title !== undefined) {
        if (!title || !title.trim()) {
            throw new ApiError(400, "Title cannot be empty or whitespace.");
        }
        resource.title = title.trim();
    }

    if (url !== undefined) {
        if (!url || !url.trim()) {
            throw new ApiError(400, "URL cannot be empty or whitespace.");
        }
        resource.url = url.trim();
    }

    if (title === undefined && url === undefined) {
        throw new ApiError(400, "Nothing to update. Provide title or url.");
    }

    await resource.save();

    return res.status(200).json(
        new ApiResponse(200, formatResource(resource), "Resource updated successfully.")
    );
});

export { updateResource };