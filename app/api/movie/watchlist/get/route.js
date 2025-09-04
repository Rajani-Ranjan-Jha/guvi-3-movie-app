import ConnectToDB from "@/utils/connect";
import { NextResponse } from "next/server";
import Watchlist from "@/models/watchlist";
import User from "@/models/user";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user_email = searchParams.get("email");

  if (!user_email) {
    return NextResponse.json({ error: "User is required" }, { status: 400 });
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

    const WatchList = await Watchlist.find({ user_id: existingUser._id });
    if (!WatchList || WatchList.length === 0) {
      return NextResponse.json(
        {
          message: "No movies found for the current user",
          watchList: WatchList,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Watchlist retrieved successfully", watchList: WatchList },
      { status: 201 }
    );
  } catch (error) {
    console.error("GET watchlist error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
