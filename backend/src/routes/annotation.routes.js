import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createAnnotation,
  getResourceAnnotations,
  getAnnotationById,
  updateAnnotation,
  deleteAnnotation,
} from "../controllers/annotation.controller.js";

const router = Router();

router.route('/resources/:resourceId/annotations')
  .post(verifyJWT, createAnnotation)
  .get(verifyJWT, getResourceAnnotations);

router.route('/annotations/:annotationId')
  .get(verifyJWT, getAnnotationById)
  .put(verifyJWT, updateAnnotation)
  .delete(verifyJWT, deleteAnnotation);

export default router;