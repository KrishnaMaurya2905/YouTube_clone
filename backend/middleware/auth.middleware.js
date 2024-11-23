import { user } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
export const verifieyjwt = asynchandler(async (req, res, next) => {
  try {
    const token = 
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }
    
    const decodeToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECERET || "CHSOR54cvWIC-40SCbbWRHSDKCIgfKFi$%-FRGHDS"
    );                  

    const User = await user
      .findById(decodeToken?._id)
      .select("-password -refreshToken");

    if (!User) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = User;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message);
  }
});
