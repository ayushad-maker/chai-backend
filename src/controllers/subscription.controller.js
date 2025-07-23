import mongoose from "mongoose"
import {ApiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {subscription } from "../models/subscription.models.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel Id.");
    }

    if (subscriberId.toString() === channelId.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel.");
    }

    const existing = await subscription.findOne({
        channel: channelId,
        subscriber: subscriberId,
    });

    if (existing) {
        await subscription.deleteOne({
            channel: channelId,
            subscriber: subscriberId,
        });

        return res.status(200).json(
            new apiResponse(200, null, "Successfully unsubscribed.")
        );
    } else {
        const newSubscription = await subscription.create({
            channel: channelId,
            subscriber: subscriberId,
        });

        return res.status(200).json(
            new apiResponse(200, newSubscription, "Successfully subscribed.")
        );
    }
});
  
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId || !mongoose.Types.ObjectId.isValid(channelId)){
        return new ApiError(400,"Invalid Channel Id.")
    }
   
const subscriber = await subscription.find({channel:channelId})
.populate("subscriber","username avatarImg")
.sort({createdAt:-1})


return res
.status(200)
.json(
    new apiResponse(200,"Successfully get all channel subscribers.",subscriber)
)
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId || !mongoose.Types.ObjectId.isValid(subscriberId)){
        return new ApiError(400,"Subscriber id is inValid!.");
    }

    const subscribedChannels = await subscription.find({subscriber:subscriberId})
    .populate("channel","username avtarImg")
    .sort({createdAt:-1})

    return res
    .status(200)
    .json(
        new apiResponse(200,subscribedChannels,"Get all SubscribedChannels successfully.")
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}