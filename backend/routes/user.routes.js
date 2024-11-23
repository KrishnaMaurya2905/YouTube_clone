import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getAllusers,
  deleteUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  getUserChannelProfile,
  updateUserAvatar,
  // getUserWatchHistory,
  updateUserCoverImage,
  addVideoToWatchHistory,
  getWatchHistory,
  removeVideoFromWatchHistory,
  isUserLoggedIn,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifieyjwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
    },
    {
      name: "coverImage",
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifieyjwt, logoutUser);

router.route("/refreshAccessToken").post(verifieyjwt, refreshAccessToken);

router.route("/changePassword").post(verifieyjwt, changeCurrentPassword);

router.route("/currentUser").get(verifieyjwt, getCurrentUser);

router.route("/updateAccountDetails").patch(verifieyjwt, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifieyjwt, upload.single("avatar"), updateUserAvatar);

router
  .route("/coverImage")
  .patch(verifieyjwt, upload.single("coverImage"), updateUserCoverImage);

router
  .route("/userChannelProfile/:username/:category")
  .get( verifieyjwt ,getUserChannelProfile);

router.route("/userWatchHistory").get(verifieyjwt, getWatchHistory);

router.route("/AllUsers").get(getAllusers);

router.route("/deleteUser/:id").delete(deleteUser);

router.route("/removeVideoFromWatchHistory/:videoId").delete(verifieyjwt, removeVideoFromWatchHistory);

router.route("/userWatchHistory/:videoId").get(verifieyjwt, addVideoToWatchHistory);

router.route("/isUserLoggedIn").get(verifieyjwt, isUserLoggedIn);

export default router;
