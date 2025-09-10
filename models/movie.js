import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
  tmdb_id: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  // reviews:{
  //     type: Array,
  // },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      unique: true,
    },
  ],
});

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);
export default Movie;
