import { Annotation } from "../models/annotation.model.js";
import { Resource } from "../models/resource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


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

  const annotations = await Annotation.find({ resourceId })
    .populate("createdBy", "username email")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, annotations, "Annotations fetched successfully")
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

  return res.status(200).json(
    new ApiResponse(200, annotation, "Annotation fetched successfully")
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