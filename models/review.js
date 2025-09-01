import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  movie_id: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  // author_details: {
  //   avatar_path: {
  //     type: String,
  //   },
  //   name: {
  //     type: String,
  //   },
  //   author_id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  // },
  title: {
    type: String,
    // required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    // default: Math.random()
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;
