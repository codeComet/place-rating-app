import mongoose from "mongoose";

const PinSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 4,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const PinModel = mongoose.model("pin", PinSchema);

export default PinModel;
