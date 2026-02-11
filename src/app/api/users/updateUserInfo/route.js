import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

export async function PATCH(req) {
  try {
    const authUser = await currentUser();
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { clerkUserId: authUser.id },
      {
        firstname: body.fullname?.split(" ")[0] || "",
        lastname: body.fullname?.split(" ")[1] || "",
        bio: body.bio,
        tagline: body.tagline,
        video: body.video,
        themeColor: body.themeColor,
        coffeeName: body.coffeeName,
        showSupporterCount: body.showSupporterCount,
      },
      { new: true },
    ).lean();

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (err) {
    console.error("[creator:update]", err);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
