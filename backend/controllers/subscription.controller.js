import { asynchandler } from "../utils/asynchandler.js";
import { subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { user } from "../models/user.model.js";

const toggleSubscription = asynchandler(async (req, res) => {
  const subscriberId = req.user._id.toString();
  const channelId = req.params.id;

  if (!subscriberId || !channelId) {
    return res.status(400).json(new ApiError(400, "", "Please provide subscriber and channel IDs"));
  }

  if (subscriberId === channelId) {
    return res.status(400).json(new ApiError(400, "", "You cannot subscribe to yourself"));
  }

  const channelUser = await user.findById(channelId);
  if (!channelUser) {
    return res.status(404).json(new ApiError(404, "", "Channel not found"));
  }

  const existingSubscription = await subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Subscription deleted successfully"));
  } else {
    const newSubscription = new subscription({
      subscriber: subscriberId,
      channel: channelId,
    });

    await newSubscription.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newSubscription, "Subscription created successfully"));
  }
});

const getAllSubscriptions = asynchandler(async (req, res) => {
  const subscriptions = await subscription
    .find({ subscriber: req.user._id})
    .populate("channel", "username avatar fullname");

  const channels = subscriptions.map(sub => sub.channel);

  res.status(200).json(new ApiResponse(200, channels, "Channels fetched successfully"));
});



export { toggleSubscription , getAllSubscriptions };
