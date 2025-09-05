import ConnectToDB from "@/utils/connect";
import { NextResponse } from "next/server";
import Watchlist from "@/models/watchlist";
import User from "@/models/user";

export async function POST(request) {
  const { user_email, media_id } = await request.json();

  if (!user_email || !media_id) {
    return NextResponse.json(
      { error: "User and Movie ID is required" },
      { status: 400 }
    );
  }

  try {
    await ConnectToDB();

    const existingUser = await User.findOne({ email: user_email });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User dons't exists" },
        { status: 404 }
      );
    }

    // finding the watchlist and deleting
    const WatchListMovie = await Watchlist.findOneAndDelete({ user_id: existingUser._id, media_id: media_id });
    // if (!WatchListMovie || WatchListMovie.length === 0) {
    //   return NextResponse.json(
    //     {
    //       message: "No movies found for the current user",
    //     },
    //     { status: 404 }
    //   );
    // }

    // removing the ID of watchlist from the array of user
    existingUser.watchlist.pop(WatchListMovie._id)
    await existingUser.save()

    // WatchListMovie.delete()

    return NextResponse.json(
      { message: "Movie removed from the watchlist"},
      { status: 201 }
    );
  } catch (error) {
    console.error("REMOVE watchlist error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
