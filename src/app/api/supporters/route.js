import { NextResponse } from "next/server";
import dbConnect from "@/dbConnect/dbConnect";
import User from "@/models/userSchema";
import Supporter from "@/models/supporterSchema";

const PRICE_PER_CHAI = 50;
const MAX_CHAI_COUNT = 1000;
const MAX_NAME_LENGTH = 60;
const MAX_MESSAGE_LENGTH = 500;

const getDisplayName = (creator) =>
  creator.firstname || creator.lastname
    ? [creator.firstname, creator.lastname].filter(Boolean).join(" ")
    : creator.username || "Creator";

const buildUpiLink = ({ upiId, payeeName, amount, note }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim().toLowerCase();
    const chaiCount = Number(body.chaiCount || 1);

    if (!username) {
      return NextResponse.json(
        { error: "Creator username is required." },
        { status: 400 },
      );
    }

    if (!Number.isFinite(chaiCount) || chaiCount < 1 || chaiCount > MAX_CHAI_COUNT) {
      return NextResponse.json(
        { error: "Choose a valid chai count." },
        { status: 400 },
      );
    }

    const name = String(body.name || "").trim().slice(0, MAX_NAME_LENGTH);
    const message = String(body.message || "").trim().slice(0, MAX_MESSAGE_LENGTH);
    const isPrivate = Boolean(body.isPrivate);

    await dbConnect();

    const creator = await User.findOne({
      username,
      onboardingCompleted: true,
    }).lean();

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found." },
        { status: 404 },
      );
    }

    if (!creator.upiId) {
      return NextResponse.json(
        { error: "Creator has not added a UPI ID yet." },
        { status: 400 },
      );
    }

    const amount = chaiCount * PRICE_PER_CHAI;
    const creatorName = getDisplayName(creator);
    const upiLink = buildUpiLink({
      upiId: creator.upiId,
      payeeName: creatorName,
      amount,
      note: name ? `Support from ${name}` : "Support via Ek Cup Chai",
    });

    const supporter = await Supporter.create({
      creatorId: creator._id,
      creatorUsername: creator.username,
      name,
      message,
      amount,
      chaiCount,
      currency: "INR",
      isPrivate,
      paymentProvider: "UPI",
      status: "initiated",
    });

    return NextResponse.json({
      success: true,
      upiLink,
      supporter: {
        id: supporter._id.toString(),
        name: supporter.name,
        message: supporter.message,
        amount: supporter.amount,
        chaiCount: supporter.chaiCount,
        isPrivate: supporter.isPrivate,
        createdAt: supporter.createdAt,
      },
      creator: {
        username: creator.username,
        displayName: creatorName,
      },
    });
  } catch (err) {
    console.error("[supporters:POST]", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = String(searchParams.get("username") || "")
      .trim()
      .toLowerCase();

    if (!username) {
      return NextResponse.json(
        { error: "Creator username is required." },
        { status: 400 },
      );
    }

    const limit = Math.min(
      20,
      Math.max(1, Number(searchParams.get("limit") || 8)),
    );

    await dbConnect();

    const creator = await User.findOne({
      username,
      onboardingCompleted: true,
    }).lean();

    if (!creator) {
      return NextResponse.json(
        { error: "Creator not found." },
        { status: 404 },
      );
    }

    const supporters = await Supporter.find({ creatorId: creator._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      supporters: supporters.map((supporter) => ({
        id: supporter._id.toString(),
        name: supporter.name,
        message: supporter.message,
        amount: supporter.amount,
        chaiCount: supporter.chaiCount,
        isPrivate: supporter.isPrivate,
        createdAt: supporter.createdAt,
      })),
    });
  } catch (err) {
    console.error("[supporters:GET]", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
