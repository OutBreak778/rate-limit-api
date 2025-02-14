import mongoose from "mongoose";

const Schema = mongoose.Schema;
const subscriptionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minLen: 3,
      maxLen: 50,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "INR", "EUR"],
      default: "INR",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "Sport",
        "Entertainment",
        "News",
        "Lifestyle",
        "Technology",
        "Finance",
        "Politics",
        "Others",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Cancel", "Expired"],
      default: "Active",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Start date must be in past",
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after startDate",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.pre("save", function (next) {
  if (!this.renewlDate) {
    const renewalPeriod = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate)
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency])
  }

  if(this.renewalDate < new Date().getTime()) {
    this.status = "Expired"
  }

  next()
});

export const Subscription = mongoose.model("subscription", subscriptionSchema)