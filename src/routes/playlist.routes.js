import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(verifyJWT);

// Create new playlist
router.route("/").post(createPlaylist);

// Get, Update, Delete playlist by ID
router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

// Add video to playlist
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);


router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

// Get playlists of a user
router.route("/user/:userId").get(getUserPlaylists);

export default router;
