import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const { timestamp, folder } = body;

    const signature = cloudinary.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET,
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (err) {
    return NextResponse.json({ error: "Signature error" }, { status: 500 });
  }
}
