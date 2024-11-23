import { Router } from "express";
import { verifieyjwt } from "../middleware/auth.middleware.js";
import { ToggleLike , getAllLikedVideos} from "../controllers/like.controller.js";

const LikeRouter = Router();

LikeRouter.post("/:id", verifieyjwt, ToggleLike);
LikeRouter.get("/LikedVideos", verifieyjwt, getAllLikedVideos);

export default LikeRouter;