import { Router } from "express";
import { loginUser, logOutUser, registerUser,refreshAccessToken, changeCurrentUserPassword, getcurrentUser, updateAccountDetails, updateUserAvatar, updateCoverImg, getUserProfile, getWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../middleware/auth.middleware.js";


const { verify } = jwt;

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// Secured route
router.route("/logout").post(verifyJWT, logOutUser);

router.route("/refresh-Token").post(refreshAccessToken);

router.route("/password-change").post(verifyJWT,changeCurrentUserPassword);

router.route("/current-user").get(verifyJWT,getcurrentUser);

router.route("/update-account").patch(verifyJWT,updateAccountDetails);

router.route("/avtar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);

router.route("/cover-image").patch(verifyJWT,upload.single("CoverImg"),updateCoverImg);

router.route("/c/:username").get(verifyJWT,getUserProfile);

router.route("/history").get(verifyJWT,getWatchHistory); 



export default router;
