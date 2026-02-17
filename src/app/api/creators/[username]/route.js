import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

export async function GET(req, { params }) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const creator = await User.findOne({
      username: username.toLowerCase(),
      onboardingCompleted: true,
    }).lean();

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Convert MongoDB ObjectId to string
    const creatorData = {
      ...creator,
      _id: creator._id.toString(),
      createdAt: creator.createdAt?.toISOString?.() ?? null,
      updatedAt: creator.updatedAt?.toISOString?.() ?? null,
    };

    return NextResponse.json({ success: true, creator: creatorData });
  } catch (error) {
    console.error("[api/creators/[username]]", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
