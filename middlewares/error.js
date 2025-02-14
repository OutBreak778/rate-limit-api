export const errorMiddleware = async (err, req, res, next) => {
  try {
    const error = { ...err };

    error.message = err.message;
    console.error(err);

    if (err.name === "CastError") {
      const msg = "Resouce not found";
      error = new Error(msg);
      error.statusCode = 401;
    }

    if (err.code === 11000) {
      const msg = "Duplicate value entered here";
      error = new Error(msg);
      error.statusCode = 400;
    }

    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map((value) => value.message);
      error = new Error(msg.join(", "));
      error.statusCode = 401;
    }

    res
      .status(error.statusCode || 500)
      .json({
        success: false,
        error: error.message || "Internal Server Error",
      });
    next();
  } catch (error) {
    next(error);
  }
};
