import ConnectToDB from "@/utils/connect";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import Movie from "@/models/movie";
import Review from "@/models/review";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tmdb_id = searchParams.get("id");
  // const { tmdb_id } = await request.json();
  if (!tmdb_id) {
    return NextResponse.json(
      { error: "movie id is required" },
      { status: 400 }
    );
  }
  try {
    await ConnectToDB();

    const reviewList = await Review.find({ movie_id: tmdb_id }).sort({ updatedAt: -1 });
    if (reviewList.length == 0) {
      return NextResponse.json(
        {
          message: "Didnot get any review for this movie", status: 404
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Review List recieved successfully", reviews: reviewList, status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Review Retrieving error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
