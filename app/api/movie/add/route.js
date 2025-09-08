import ConnectToDB from "@/utils/connect";
import { NextResponse } from "next/server";
import Movie from "@/models/movie";
import Review from "@/models/review";

export async function POST(request) {
  const { tmdb_id, tmdb_rating, reviews } = await request.json();
  if (!tmdb_id) {
    return NextResponse.json(
      { error: "movie id is required" },
      { status: 400 }
    );
  }

  try {
    await ConnectToDB();

    // check if movie exists
    const existingMovie = await Movie.findOne({ tmdb_id: tmdb_id });
    if (!existingMovie) {
      const newMovie = new Movie({
        tmdb_id: tmdb_id,
        rating: tmdb_rating,
        reviews: [],
      });
      await newMovie.save();



      for (const r of reviews) {
        // console.log("aDDinG review: ",r.id)
        const newReview = new Review({
          movie_id: tmdb_id,
          author: r?.author,
          content: r?.content,
          rating: r.author_details?.rating || Math.floor(Math.random()*10),
          createdAt:r.created_at,
          updatedAt:r.updated_at
        });

        await newReview.save();

        newMovie.reviews.push(newReview._id);
      }

      await newMovie.save();

      return NextResponse.json(
        { message: "Movie info added successfully", status: 200 },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Movie info already exists, nothing added", status: 409 },
      { status: 409 }
    );
  } catch (error) {
    console.error("Movie Creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
