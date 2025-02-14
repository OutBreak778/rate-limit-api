import jwt from "jsonwebtoken";
import { User } from "../models/user-model.js";

export const authorized = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(500).json({message: "Unauthorized Access"})
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("Something went wrong, please try again!");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error"})
  }
};
