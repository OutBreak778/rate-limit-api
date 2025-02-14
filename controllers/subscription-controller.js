import { Subscription } from "../models/subscription-model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    if (!subscription) {
      const error = new Error("Subscription not found in database");
      error.statusCode = 404;
      throw error;
    }

    return res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.statusCode = 401;
      throw error;
    }
    const subscription = await Subscription.find({ user: req.params.id });

    if (!subscription) {
      const error = new Error("Subscription not found in database");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found in database");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
export const getSubscriptions = async (req, res, next) => {
  try {
    const subscription = await Subscription.find({});

    if (!subscription) {
      const error = new Error("Subscription not found in database");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!subscription) {
      const error = new Error("Subscription not found in database");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ success: true, message: "Subscription delete Successfully", data: subscription._id});
  } catch (error) {
    next(error);
  }
};
