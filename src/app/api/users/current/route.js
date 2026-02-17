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

    const userDb = await User.findOne({ clerkUserId: authUser.id }).lean();

    if (!userDb) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert MongoDB ObjectId to string
    const user = {
      ...userDb,
      _id: userDb._id.toString(),
      createdAt: userDb.createdAt?.toISOString?.() ?? null,
      updatedAt: userDb.updatedAt?.toISOString?.() ?? null,
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[api/users/current]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
