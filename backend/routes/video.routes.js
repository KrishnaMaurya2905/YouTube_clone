import { Router } from "express";
import { uploadVideo , deleteVideo, getVideoById, getVideoViews } from "../controllers/video.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifieyjwt } from "../middleware/auth.middleware.js";

const VideoRouter = Router();


VideoRouter.post(
  "/upload",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifieyjwt,
  uploadVideo
);


VideoRouter.delete("/:id", deleteVideo);
VideoRouter.get("/:id", getVideoById);

VideoRouter.get("/views/:id", verifieyjwt, getVideoViews);


export default VideoRouter;
