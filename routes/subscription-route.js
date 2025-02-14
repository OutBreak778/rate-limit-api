import express from "express";
import { authorized } from "../middlewares/auth.js";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getSubscriptions,
  getUserSubscription,
} from "../controllers/subscription-controller.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/", getSubscriptions);
subscriptionRouter.get("/:id", getSubscription);
subscriptionRouter.post("/", authorized, createSubscription);
subscriptionRouter.put("/:id", (req, res) =>
  res.send({ message: "UPDATE subscription" })
);
subscriptionRouter.delete("/:id", deleteSubscription);
subscriptionRouter.get("/user/:id", authorized, getUserSubscription);
subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send({ message: "CANCEL subscription" })
);
subscriptionRouter.get("/upcoming-renewal", (req, res) =>
  res.send({ message: "UPCOMING new subscription" })
);

export default subscriptionRouter;
