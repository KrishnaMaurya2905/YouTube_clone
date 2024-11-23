import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import mongoose from "mongoose";
import { uploadfiletocloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { video } from "../models/video.model.js";
import { WatchHistory } from "../models/WatchHistory.model.js";

const generateAccessAndRefreshtoken = async (userId) => {
  try {
    const userfound = await user.findOne(userId);
    const accessToken = await userfound.generateAccessToken();
    const refreshtoken = await userfound.generateRefreshToken();
    userfound.refreshtoken = refreshtoken;
    await userfound.save({ validateBeforeSave: false });
    return { refreshtoken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wront while generating Access and Refresh token "
    );
  }
};

const registerUser = asynchandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  if (fullname === "") {
    throw new ApiError(400, "fullname is required ");
  }
  if (email === "") {
    throw new ApiError(400, "email is required ");
  }
  if (username === "") {
    throw new ApiError(400, "username is required ");
  }
  if (password === "") {
    throw new ApiError(400, "password is required ");
  }
  const existeduser = await user.findOne({
    $or: [{ username }, { email }],
  });

  if (existeduser) {
    throw new ApiError(409, "username with email already exists");
  }

  const avatarlocalpath = await req?.files?.avatar[0]?.path;
  let coverImagelocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagelocalpath = req.files.coverImage[0].path;
  }
  console.log(req.files);
  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar file is required");
  }

  let avatar, coverImage;

  try {
    avatar = await uploadfiletocloudinary(avatarlocalpath);
    coverImage = await uploadfiletocloudinary(coverImagelocalpath);
  } catch (error) {
    throw new ApiError(
      400,
      `Error uploading file to Cloudinary: ${error.message}`
    );
  }
  if (!avatar) {
    throw new ApiError(
      400,
      "error found while uploading avatar file in cloudinary"
    );
  }

  const createuser = await user.create({
    fullname,
    avatar: avatar.url,
    username: username.toLowerCase(),
    coverImage: coverImage?.url || "",
    password,
    email,
  });

  const createduser = await user
    .findById(createuser._id)
    .select("-password -refreshtoken");

  if (!createduser) {
    throw new ApiError(500, "something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createduser, "user has been registered sucessfully ")
    );
});

const loginUser = asynchandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const userfound = await user.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  });
  console.log(userfound._id);
  if (!userfound) {
    throw new ApiError(404, "user not found ");
  }

  const ispasswordvalid = await userfound.isPasswordCorrect(password);
  console.log(ispasswordvalid);
  if (!ispasswordvalid) {
    throw new ApiError(401, "password is Invalid");
  }
  const { accessToken, refreshtoken } = await generateAccessAndRefreshtoken(
    userfound._id
  );
  const loggedinuser = await user
    .findById(userfound._id)
    .select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshtoken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinuser,
          accessToken,
          refreshtoken,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = asynchandler(async (req, res) => {
  await user.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user Logged out succesfully"));
});

const getAllusers = asynchandler(async (req, res) => {
  const users = await user.find();

  if (!users) {
    throw new ApiError(404, "users not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, users, "users found successfully"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingAccessToken = req.cookies?.accessToken;

  if (!incomingAccessToken) {
    throw new ApiError(400, "Invalid access token");
  }

  try {
    const decodedAccessToken = await jwt.verify(
      incomingAccessToken,
      process.env.ACCESS_TOKEN_SECERET ||
        "CHSOR54cvWIC-40SCbbWRHSDKCIgfKFi$%-FRGHDS"
    );

    console.log(decodedAccessToken?._id);

    const userfound = await user.findById(decodedAccessToken?._id);

    if (!userfound) {
      throw new ApiError(404, "User not found");
    }

    const { accessToken, refreshtoken } = await generateAccessAndRefreshtoken(
      userfound._id
    );
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        secure: true,
      })
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshtoken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});

const changeCurrentPassword = asynchandler(async (req, res) => {
  const { currentpassword, newpassword } = req.body;
  const userfound = await user.findById(req.user._id);
  const ispasswordvalid = await userfound.isPasswordCorrect(currentpassword);
  if (!ispasswordvalid) {
    throw new ApiError(401, "password is Invalid");
  }
  userfound.password = newpassword;
  await userfound.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});

const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails = asynchandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "fullname and email are required");
  }
  const updatedUser = await user
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: { fullname, email },
      },
      { new: true }
    )
    .select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "user updated successfully"));
});

const updateUserAvatar = asynchandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  console.log(avatarLocalPath);

  const avatar = await uploadfiletocloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "avatar url not found");
  }

  const updatedUser = await user
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: { avatar: avatar.url },
      },
      { new: true }
    )
    .select("-password");

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "user avatar updated successfully")
    );
});

const updateUserCoverImage = asynchandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "cover image file is required");
  }

  const coverImage = await uploadfiletocloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "cover image url not found");
  }

  const updatedUser = await user
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: { coverImage: coverImage.url },
      },
      { new: true }
    )
    .select("-password");
  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "user cover image updated successfully")
    );
});



const getUserChannelProfile = asynchandler(async (req, res) => {
  const { username , category } = req.params;
  const currentUserId = req.user._id;
  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }

  const channel = await user.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers", // Get all subscribers of the channel
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriptions", // Get all subscriptions of the user
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos", 
      },
    },
    {
      $addFields: {
        videos: {
          $sortArray: {
            input: "$videos",
            sortBy: category === "popular" ? { views: -1 } : { createdAt: category === "latest" ? -1 : 1 }, 
          },
        },
      },
    },    
    {
      $addFields: {
        subscribersCount: {
          $cond: {
            if: { $isArray: "$subscribers" }, 
            then: { $size: "$subscribers" }, 
            else: 0, // Default to 0 if it's not an array
          },
        },
        subscriptionsCount: {
          $cond: {
            if: { $isArray: "$subscriptions" }, // Check if subscriptions is an array
            then: { $size: "$subscriptions" }, // Count subscriptions if it's an array
            else: 0, // Default to 0 if it's not an array
          },
        },
        videosCount: {
          $cond: {
            if: { $isArray: "$videos" }, // Check if videos is an array
            then: { $size: "$videos" }, // Count videos if it's an array
            else: 0, // Default to 0 if it's not an array
          },
        },
        isSubscribed: {
          $in: [currentUserId, "$subscribers.subscriber"], // Check if current user is in the subscribers list
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscriptionsCount: 1, 
        subscribersCount: 1,
        videosCount: 1, 
        isSubscribed: 1, 
        videos: { 
          _id: 1,
          title: 1,
          thumbnail: 1,
          duration: 1,
          description: 1, 
          createdAt: 1, 
          views: 1, 
        },
      },
    },
  ]);

  if (!channel || !channel.length) {
    throw new ApiError(404, "Channel not found or does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel profile fetched successfully"));
});




const deleteUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "id is required");
  }
  const deletedUser = await user.findByIdAndDelete(id).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, deletedUser, "user deleted successfully"));
});



const addVideoToWatchHistory = asynchandler(async (req, res) => {
  const { _id } = req.user; 
  const { videoId } = req.params; 

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  // Create a new watch history entry
  const watchEntry = await  WatchHistory.create({
    userId: _id,
    videoId: new mongoose.Types.ObjectId(videoId), // Ensure videoId is an ObjectId
    watchedAt: new Date(),
  });

  return res.status(201).json(new ApiResponse(201, watchEntry, "Video added to watch history"));
});

const removeVideoFromWatchHistory = asynchandler(async (req, res) => {
  const { _id } = req.user; 
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const watchEntry = await WatchHistory.findOneAndDelete({
    userId: _id,
    videoId: new mongoose.Types.ObjectId(videoId), 
  });

  return res.status(200).json(new ApiResponse(200, watchEntry, "Video removed from watch history"));
});

// make a controller to check that the user is logged in or not
const isUserLoggedIn = asynchandler(async (req, res) => {
  const { _id } = req.user;
  return res.status(200).json(new ApiResponse(200, _id, "User logged in successfully"));
})


// const getWatchHistory = asynchandler(async (req, res) => {
//   const { _id } = req.user;
//   const watchHistory = await WatchHistory.find({ userId: _id }).populate("videoId");
//   return res.status(200).json(new ApiResponse(200, watchHistory, "Watch history fetched successfully"));
// });


// const getWatchHistory = asynchandler(async (req, res) => {
//   const { _id } = req.user;
//   // aggreagate query
//   const watchHistory = await WatchHistory.aggregate([
//     {
//       $match: { userId: _id },
//     },
//     {
//       $lookup: {
//         from: "videos",
//         localField: "videoId",
//         foreignField: "_id",
//         as: "videoDetails",
//       },
//     },
//     {
//       $unwind: "$videoDetails",
//     },
//     {
//       $project: {
//         _id: 1,
//         videoId: 1,
//         watchedAt: 1,
//         "videoDetails.title": 1,
//         "videoDetails.thumbnail": 1,
//         "videoDetails.views": 1,
//         "videoDetails.duration": 1,
//         "videoDetails.description": 1,
//         "videoDetails.owner": 1,
//         // need the owner channelname populate from the owner field owner which is objectId

//         "videoDetails.owner": 1,
//       },
//     },
//   ]);

//   return res.status(200).json(new ApiResponse(200, watchHistory, "Watch history fetched successfully"));
// })

const getWatchHistory = asynchandler(async (req, res) => {
  const { _id } = req.user;
  
  // Aggregate query to fetch watch history with video and owner details
  const watchHistory = await WatchHistory.aggregate([
    {
      $match: { userId: _id },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videoId",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $lookup: {
        from: "users", // Assuming the owner data is stored in the 'users' collection
        localField: "videoDetails.owner", // owner is an ObjectId in the videoDetails
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: "$ownerDetails",
    },
    {
      $project: {
        _id: 1,
        videoId: 1,
        watchedAt: 1,
        "videoDetails.title": 1,
        "videoDetails.thumbnail": 1,
        "videoDetails.views": 1,
        "videoDetails.duration": 1,
        "videoDetails.description": 1,
        "ownerDetails._id": 1,
        "ownerDetails.fullname": 1, 
      },
    },
    // Sort by watchedAt in descending order (newest first)
    {
      $sort: { watchedAt: -1 }, // For ascending order use 1
    },
  ]);

  return res.status(200).json(new ApiResponse(200, watchHistory, "Watch history fetched successfully"));
});



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  // extra stuff
  getWatchHistory,
  isUserLoggedIn, 
  deleteUser,
  removeVideoFromWatchHistory,
  getAllusers,
  addVideoToWatchHistory
};
