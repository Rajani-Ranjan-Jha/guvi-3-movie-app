import User from "@/models/user";
import ConnectToDB from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import Movie from "@/models/movie";
import Review from "@/models/review";

export async function PUT(request) {
  const { NewRating, NewReview, tmdb_id } = await request.json();
  // console.log("update:", { NewRating, NewReview, tmdb_id })
  if (!NewRating || !NewReview || !tmdb_id) {
    return NextResponse.json(
      { error: "All fields are required including tmdb_id" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ConnectToDB();

    // // Fetch the user to get username
    // const user = await User.findById(session.user.id);
    // if (!user) {
    //   return NextResponse.json({ error: "User not found" }, { status: 404 });
    // }

    // Find the existing review
    const existingReview = await Review.findOne({ movie_id: tmdb_id, author: session.user.username });
    if (existingReview) {
      // Update the review
      existingReview.content = NewReview;
      existingReview.rating = NewRating;
      existingReview.updatedAt = new Date();
      await existingReview.save();
      return NextResponse.json(
        { message: "Review updated successfully", status: 200 },
        { status: 200 }
      );
    } 
    return NextResponse.json(
        { message: "The review doesn't exists, create new review" },
        { status: 404 }
      );

  } catch (error) {
    console.error("Review update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
