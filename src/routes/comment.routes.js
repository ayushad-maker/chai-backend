import { Router } from 'express';
import {
    addComments,
    deleteComments,
    getVideosComments,
    updateComments
} from "../controllers/comment.controller.js";
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideosComments).post(addComments);
router.route("/c/:commentId").delete(deleteComments).patch(updateComments);

export default router;

console.log("Comment router loaded")