import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));

// Static files
app.use(express.static("public"));

// Cookie parser middleware
app.use(cookieParser());

// Importing routes
import router from "./routes/user.routes.js";  // Ensure this path is correct
import VideoRouter from "./routes/video.routes.js";
import SubscriptionRouter from "./routes/subscription.routes.js";
import LikeRouter from "./routes/like.routes.js";
app.use('/api/v1/users', router);
app.use('/api/v1/videos', VideoRouter);
app.use('/api/v1/subscription', SubscriptionRouter);
app.use('/api/v1/like', LikeRouter);
export { app };
