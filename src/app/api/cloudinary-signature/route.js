import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("BODY FROM WIDGET:", body);

    // ✅ VERY IMPORTANT
    const paramsToSign = body.paramsToSign;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET,
    );

    return NextResponse.json({
      signature,
      timestamp: paramsToSign.timestamp,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signature failed" }, { status: 500 });
  }
}
