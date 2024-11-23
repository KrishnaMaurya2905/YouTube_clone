import { video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import {
  uploadfiletocloudinary,
  deletefilefromcloudinary,
} from "../utils/cloudinary.js";

const uploadVideo = asynchandler(async (req, res) => {
  const { title, description , category } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Please provide all fields");
  }

  const videoFile = req.files.videoFile[0].path;
  const thumbnail = req.files.thumbnail[0].path;

  if (!videoFile || !thumbnail ) {
    throw new ApiError(400, "Please provide video and thumbnail");
  }

  let cloudinaryVideo;
  let cloudinaryThumbnail;

  try {
    cloudinaryVideo = await uploadfiletocloudinary(videoFile);
    cloudinaryThumbnail = await uploadfiletocloudinary(thumbnail);
  } catch (error) {
    throw new ApiError(500, "Something went wrong while uploading video");
  }

  const Video = new video({
    videoFile: cloudinaryVideo.url,
    thumbnail: cloudinaryThumbnail.url,
    title,
    description,
    category,
    duration: cloudinaryVideo.duration,
    owner: req.user._id,
  });

  await Video.save();

  res
    .status(200)
    .json(new ApiResponse(200, Video, "Video uploaded successfully"));
});

const deleteVideo = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Please provide video id");
  }

  const Video = await video.findByIdAndDelete(id);
  // const Video = await video.findById(id);

  if (!Video) {
    throw new ApiError(404, "Video not found");
  }
  console.log(Video);

  // alseo delete the video from the cloudinary

  try {
    await deletefilefromcloudinary(Video.videoFile, "video");
    await deletefilefromcloudinary(Video.thumbnail);
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deleting video");
  }

  res
    .status(200)
    .json(new ApiResponse(200, Video, "Video deleted successfully"));
});

const getVideoById = asynchandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Please provide video id");
  }
  const Video = await video.findById(id);
  if (!Video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json(new ApiResponse(200, Video, "Video found successfully"));
});


// const getVideoViews = asynchandler(async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     throw new ApiError(400, "Please provide video id");
//   }
//   const Video = await video.findById(id);
//   if (!Video) {
//     throw new ApiError(404, "Video not found");
//   }
//   await video.findByIdAndUpdate(
//     id,
//     {
//       $inc: { views: 1 },
//     },
//     { new: true }
//   );
//   res
//     .status(200)
//     .json(new ApiResponse(200, null, "Video views updated successfully"));
// });

// const getVideoViews = asynchandler(async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;
  
//   if (!id) {
//     throw new ApiError(400, "Please provide video id");
//   }

//   // Find the video by its ID
//   const Video = await video.findById(id);
//   if (!Video) {
//     throw new ApiError(404, "Video not found");
//   }

//   // Check if the user has already viewed the video
//   const hasViewed = Video.viewers && Video.viewers.includes(userId);
  
//   if (!hasViewed) {
//     await video.findByIdAndUpdate(
//       id,
//       {
//         $inc: { views: 1 },
//         $push: { viewers: userId }, // Add the userId to the viewers array
//       },
//       { new: true }
//     );
//     res
//       .status(200)
//       .json(new ApiResponse(200, null, "Video views updated successfully"));
//   } else {
//     // If the user has already viewed the video
//     res.status(200).json(new ApiResponse(200, null, "User has already viewed this video"));
//   }
// });

const getVideoViews = asynchandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;  // Assuming req.user contains the authenticated user's ID
  
  if (!id) {
    throw new ApiError(400, "Please provide video id");
  }

  const Video = await video.findById(id);
  if (!Video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the user has already viewed the video
  const hasViewed = Video.viewers && Video.viewers.includes(userId);
  
  if (!hasViewed) {
    // If the user hasn't viewed it yet, increment the view count
    await video.findByIdAndUpdate(
      id,
      {
        $inc: { views: 1 } 
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(200, null, "Video views updated successfully"));
  } else {
    // If the user has already viewed the video, return a response without increasing the view count
    res.status(200).json(new ApiResponse(200, null, "User has already viewed this video"));
  }
});





export { uploadVideo, deleteVideo, getVideoById, getVideoViews };
