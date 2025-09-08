import ConnectToDB from "@/utils/connect";
import { NextResponse } from "next/server";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import Watchlist from "@/models/watchlist";
import User from "@/models/user";

export async function POST(request) {
  const {media_type, media_id, user_email, media_data } = await request.json();
  if (!media_type || !media_id || !user_email || !media_data) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ConnectToDB();

    const existingUser = await User.findOne({ email: user_email });
    if (!existingUser) {
      return NextResponse.json({ error: "User dons't exists" }, { status: 404 });
    }

    const newWatchList = await Watchlist({
      media_id: media_id,
      media_type: media_type,
      media_data: media_data,
      user_id: existingUser._id,
    });

    await newWatchList.save();

    existingUser.watchlist.push(newWatchList._id)
    await existingUser.save()

    return NextResponse.json(
      { message: "Movie added to watchlist" },
      { status: 201 }
    );
  } catch (error) {
    console.error("watchlist error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
