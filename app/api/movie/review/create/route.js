import ConnectToDB from "@/utils/connect";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import Movie from "@/models/movie";
import Review from "@/models/review";
import User from "@/models/user";

export async function POST(request) {
  const { rating, review, tmdb_id, tmdb_rating } = await request.json();
  if (!rating || !review || !tmdb_id || !tmdb_rating) {
    return NextResponse.json(
      { error: "All fields are required including tmdb_id and tmdb_rating" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ConnectToDB();

    // Fetch the user to get username
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // create a review with author
    const newReview = new Review({
      movie_id: tmdb_id,
      author: user.username,
      content: review,
      rating: rating,
    });

    await newReview.save();

    // check if movie exists
    const existingMovie = await Movie.findOne({ tmdb_id: tmdb_id });
    if (existingMovie) {
      existingMovie.reviews.push(newReview._id);
      await existingMovie.save();
    } else {
      const newMovie = new Movie({
        tmdb_id: tmdb_id,
        rating: tmdb_rating,
        reviews: [newReview._id],
      });
      await newMovie.save();
    }

    return NextResponse.json(
      { message: "Review created successfully", reviewId: newReview._id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Review Creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
