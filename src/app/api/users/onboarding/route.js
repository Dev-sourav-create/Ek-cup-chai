import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

export async function PATCH(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, bio, country, upiId, qrImageUrl, imageUrl } = body;

    await dbConnect();

    if (username !== undefined) {
      const trimmed = String(username).trim().toLowerCase();
      if (!trimmed || trimmed.length < 2) {
        return NextResponse.json(
          { error: "Username must be at least 2 characters" },
          { status: 400 },
        );
      }
      const existing = await User.findOne({
        username: trimmed,
        clerkUserId: { $ne: userId },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 },
        );
      }
    }

    const update = {};
    if (username !== undefined)
      update.username = String(username).trim().toLowerCase();
    if (bio !== undefined) update.bio = String(bio).trim();
    if (country !== undefined) update.country = String(country).trim();
    if (upiId !== undefined) update.upiId = String(upiId).trim();
    if (qrImageUrl !== undefined) update.qrImageUrl = String(qrImageUrl).trim();
    if (imageUrl !== undefined) update.imageUrl = String(imageUrl).trim();
    update.onboardingCompleted = true;

    const user = await User.findOneAndUpdate(
      { clerkUserId: userId },
      { $set: update },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ UPDATE CLERK METADATA (THIS FIXES REDIRECT LOOP)
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (err) {
    console.error("[onboarding]", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
