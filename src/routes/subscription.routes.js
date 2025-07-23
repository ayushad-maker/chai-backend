import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all routes

// Toggle subscription to a channel
router.post("/c/:channelId", toggleSubscription);

// Get subscribers of a channel
router.get("/c/:channelId/subscribers", getUserChannelSubscribers);

// Get all channels a user has subscribed to
router.get("/u/:subscriberId", getSubscribedChannels);

export default router;
