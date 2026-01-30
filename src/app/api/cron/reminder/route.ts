import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Resend } from "resend";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

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

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  const toEmail = process.env.NOTIFICATION_RECIPIENT_EMAIL;

  if (!resendApiKey || !fromEmail || !toEmail) {
    console.error("Missing Resend configuration");
    return NextResponse.json(
      { error: "Missing Resend configuration" },
      { status: 500 },
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

    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Send reminder email
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: "Daily Accomplishment Reminder",
      text: "👋 Hey! You haven't logged an accomplishment yet today. What did you achieve? Reply to this email to log it.",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>👋 Daily Accomplishment Reminder</h2>
          <p>Hey! You haven't logged an accomplishment yet today.</p>
          <p>What did you achieve? Reply to this email to log it.</p>
        </div>
      `,
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
      { status: 500 },
    );
  }
}
