import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

export async function GET() {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const creator = await User.findOne({
      clerkUserId: authUser.id,
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
    console.error("[api/creators/current]", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
