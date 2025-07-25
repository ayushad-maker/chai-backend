import { Router } from "express";
import{
    getAllVideos,
    deleteVideo,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(verifyJWT);


router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
        {
            name:"videoFile",
            maxCount : 1,
        },
        {
            name:"thumbnail",
            maxCount:1,

        },
    ]),
    publishAVideo
  );

  router
     .route("/:videoId")
     .get(getVideoById)
     .delete(deleteVideo)
     .patch(upload.single("thumbnail"),updateVideo);

  router.route("/toggle/publish/:videoID").patch(togglePublishStatus);

  export default router