import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ available: false });
  }

  await dbConnect();

  const existingUser = await User.findOne({
    username: username.toLowerCase(),
  });

  return NextResponse.json({
    available: !existingUser,
  });
}
