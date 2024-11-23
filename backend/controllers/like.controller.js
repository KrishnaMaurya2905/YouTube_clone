
import { Like } from "../models/likes.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { video } from "../models/video.model.js";

const ToggleLike = asynchandler(async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id.toString();

  if (!id) {
    return res.status(400).json(new ApiError(400, "", "Please provide video id"));
  }

  // Fetch both the video and the existing like using Promise.all to optimize performance
  const [Video, existingLike] = await Promise.all([
    video.findById(id).select('_id').lean(), // Fetch minimal fields and lean query for better performance
    Like.findOne({ videos: id, likedBy: userId }).select('_id').lean(), // Fetch only necessary data
  ]);

  // Check if video exists
  if (!Video) {
    return res.status(404).json(new ApiError(404, "", "Video not found"));
  }

  // If a like exists, remove it
  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id }); // Use deleteOne directly on the Like model

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed successfully"));
  }

  // If no like exists, create a new one
  const newLike = new Like({
    videos: id,
    likedBy: userId,
  });

  await newLike.save();

  return res
    .status(201) // Use 201 status for resource creation
    .json(new ApiResponse(201, null, "Like added successfully"));
});

const getAllLikedVideos = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const likes = await Like.find({ likedBy: userId })
    .populate({
      path: "videos",
      select: "title thumbnail views owner createdAt duration",
      populate: {
        path: "owner",
        select: "username"
      }
    })
    .select("_id videos")
    .sort({ createdAt: -1 }); // Sort by createdAt in descending order

  res.status(200).json(new ApiResponse(200, likes, "Likes fetched successfully"));
});



export { ToggleLike , getAllLikedVideos };
