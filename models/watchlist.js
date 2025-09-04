import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema({
  movie_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  movie_data: {
    type: Object,
    required: true
  },
  cretedAt:{
    type: Date,
    default: Date.now()
  }
});

const Watchlist = mongoose.models.Watchlist || mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
