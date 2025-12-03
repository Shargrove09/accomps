import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import twilio from "twilio";

export async function GET(request: Request) {
  // Security: Verify the request is from Vercel Cron
  // Vercel automatically adds this header when running cron jobs
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = process.env.USER_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.error("Missing Twilio configuration");
    return NextResponse.json(
      { error: "Missing Twilio configuration" },
      { status: 500 }
    );
  }

  try {
    // Check if an accomplishment exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await db.accomplishment.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (count > 0) {
      return NextResponse.json({
        message: "Accomplishment already logged today.",
        sent: false,
      });
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Send reminder
    await client.messages.create({
      body: "👋 Hey! You haven't logged an accomplishment yet today. What did you achieve? Reply to this message to log it.",
      from: fromNumber,
      to: toNumber,
    });

    return NextResponse.json({
      message: "Reminder sent successfully.",
      sent: true,
    });
  } catch (error) {
    console.error("Error in reminder cron job:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
