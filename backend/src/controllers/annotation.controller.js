import { Annotation } from "../models/annotation.model.js";
import { Resource } from "../models/resource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Vault } from "../models/vault.model.js";
import { VaultMember } from "../models/vaultMember.model.js";


// Helper: Check vault access
const checkAccess = async (userId, vaultId) => {
  const isOwner = await Vault.findOne({
    _id: vaultId,
    createdBy: userId,
  });

  const member = await VaultMember.findOne({
    vaultId,
    userId,
  });

  return { isOwner, member };
};


// 1. CREATE ANNOTATION
const createAnnotation = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    throw new ApiError(400, "Content is required.");
  }

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  // RBAC
  const { isOwner, member } = await checkAccess(
    req.user._id,
    resource.vaultId
  );

  if (!isOwner && (!member || member.role === "Viewer")) {
    throw new ApiError(403, "No permission to create annotation.");
  }

  const annotation = await Annotation.create({
    content,
    resourceId,
    createdBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, annotation, "Annotation created successfully")
  );
});


// 2. GET ALL ANNOTATIONS
const getResourceAnnotations = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  // RBAC (Viewer allowed)
  const { isOwner, member } = await checkAccess(
    req.user._id,
    resource.vaultId
  );

  if (!isOwner && !member) {
    throw new ApiError(403, "Access denied.");
  }

  const annotations = await Annotation.find({ resourceId })
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });

  // Flatten response
  const formatted = annotations.map((a) => ({
    id: a._id,
    content: a.content,
    resourceId: a.resourceId,
    createdAt: a.createdAt,
    userId: a.createdBy._id,
    username: a.createdBy.username,
    email: a.createdBy.email,
  }));

  return res.status(200).json(
    new ApiResponse(200, formatted, "Annotations fetched successfully")
  );
});


// 3. GET SINGLE ANNOTATION
const getAnnotationById = asyncHandler(async (req, res) => {
  const { annotationId } = req.params;

  const annotation = await Annotation.findById(annotationId)
    .populate("createdBy", "username email");

  if (!annotation) {
    throw new ApiError(404, "Annotation not found.");
  }

  const resource = await Resource.findById(annotation.resourceId);

  // RBAC
  const { isOwner, member } = await checkAccess(
    req.user._id,
    resource.vaultId
  );

  if (!isOwner && !member) {
    throw new ApiError(403, "Access denied.");
  }

  // Flatten response
  const formatted = {
    id: annotation._id,
    content: annotation.content,
    resourceId: annotation.resourceId,
    createdAt: annotation.createdAt,
    userId: annotation.createdBy._id,
    username: annotation.createdBy.username,
    email: annotation.createdBy.email,
  };

  return res.status(200).json(
    new ApiResponse(200, formatted, "Annotation fetched successfully")
  );
});


// 4. UPDATE ANNOTATION
const updateAnnotation = asyncHandler(async (req, res) => {
  const { annotationId } = req.params;
  const { content } = req.body;

  const annotation = await Annotation.findById(annotationId);

  if (!annotation) {
    throw new ApiError(404, "Annotation not found.");
  }

  const resource = await Resource.findById(annotation.resourceId);

  // RBAC
  const { isOwner, member } = await checkAccess(
    req.user._id,
    resource.vaultId
  );

  if (!isOwner && (!member || member.role === "Viewer")) {
    throw new ApiError(403, "No permission to update annotation.");
  }

  // Creator check
  if (annotation.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only update your own annotation.");
  }

  annotation.content = content;
  await annotation.save();

  return res.status(200).json(
    new ApiResponse(200, annotation, "Annotation updated successfully")
  );
});


// 5. DELETE ANNOTATION
const deleteAnnotation = asyncHandler(async (req, res) => {
  const { annotationId } = req.params;

  const annotation = await Annotation.findById(annotationId);

  if (!annotation) {
    throw new ApiError(404, "Annotation not found.");
  }

  const resource = await Resource.findById(annotation.resourceId);

  // RBAC
  const { isOwner, member } = await checkAccess(
    req.user._id,
    resource.vaultId
  );

  if (!isOwner && (!member || member.role === "Viewer")) {
    throw new ApiError(403, "No permission to delete annotation.");
  }

  if (annotation.createdBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own annotation.");
  }

  await Annotation.deleteOne({ _id: annotationId });

  return res.status(200).json(
    new ApiResponse(200, {}, "Annotation deleted successfully")
  );
});


export {
  createAnnotation,
  getResourceAnnotations,
  getAnnotationById,
  updateAnnotation,
  deleteAnnotation,
};