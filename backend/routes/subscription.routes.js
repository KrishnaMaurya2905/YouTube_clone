import { Router } from "express";
import { verifieyjwt } from "../middleware/auth.middleware.js";
import { getAllSubscriptions, toggleSubscription } from "../controllers/subscription.controller.js";

const SubscriptionRouter = Router();

SubscriptionRouter.post(
    "/subscribe/:id",
    verifieyjwt,
   toggleSubscription
);
SubscriptionRouter.get("/getAllSubscriptions", verifieyjwt, getAllSubscriptions);

export default SubscriptionRouter;
