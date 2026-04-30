import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Resource } from "../models/resource.model.js";
import { File } from "../models/file.model.js"; // Import the separate File model
import { VaultMember } from "../models/vaultMember.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vault } from "../models/vault.model.js";

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

    // 2. Create the Resource entry first
    const resource = await Resource.create({
        title,
        url,
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

    // Return the resource populated with its file info
    return res.status(201).json(
        new ApiResponse(
            201,
            { ...resource._doc, fileDetails: fileEntry },
            "Resource and file created successfully"
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

    return res.status(200).json(
        new ApiResponse(200, resources, "Resources retrieved successfully")
    );
});

export { getVaultResources };