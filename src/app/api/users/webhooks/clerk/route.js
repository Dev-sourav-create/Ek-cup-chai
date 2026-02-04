import { Webhook } from "svix";
import { headers } from "next/headers";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";

export async function POST(req) {
  console.log("🔥 [1] Webhook endpoint HIT");

  const payload = await req.text();
  console.log("🔥 [2] Payload received (length):", payload.length);

  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };

  console.log("🔥 [3] Svix headers:", svixHeaders);

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return new Response("Missing secret", { status: 500 });
  }

  const wh = new Webhook(webhookSecret);

  let event;
  try {
    event = wh.verify(payload, svixHeaders);
    console.log("✅ [4] Webhook verified:", event.type);
    console.log("📦 Clerk event data:", JSON.stringify(event.data, null, 2));
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "user.created") {
    console.log("⚠️ Ignoring event:", event.type);
    return new Response("Ignored", { status: 200 });
  }

  const { id, email_addresses, image_url, first_name, last_name } = event.data;

  const email = email_addresses?.[0]?.email_address;

  if (!email) {
    console.error("❌ No email found in event");
    return new Response("Invalid user data", { status: 400 });
  }

  await dbConnect();
  console.log("✅ [5] MongoDB connected");

  const user = await User.findOneAndUpdate(
    { clerkUserId: id },
    {
      clerkUserId: id,
      email,
      firstname: first_name || null,
      lastname: last_name || null,
      imageUrl: image_url || null,
    },
    { upsert: true, new: true },
  );

  console.log("🎉 [6] User saved in MongoDB:", user._id);

  return new Response("OK", { status: 200 });
}
