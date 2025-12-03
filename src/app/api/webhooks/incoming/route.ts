import { NextResponse } from "next/server";
import { addAccomplishment } from "@/lib/actions";
import twilio from "twilio";

export async function POST(request: Request) {
  try {
    // Parse the form data from Twilio
    const formData = await request.formData();
    const body = formData.get("Body")?.toString() || "";
    const from = formData.get("From")?.toString() || "";

    // Security: Validate that the SMS is coming from the authorized user
    if (
      process.env.USER_PHONE_NUMBER &&
      from !== process.env.USER_PHONE_NUMBER
    ) {
      console.warn(`Unauthorized SMS attempt from: ${from}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(`Received SMS from ${from}: ${body}`);

    if (!body) {
      return new NextResponse("No body provided", { status: 400 });
    }

    // TODO: Integrate with an LLM  here to:
    // 1. Parse the natural language message
    // 2. Extract title, category, tags, and description
    // 3. Handle conversational context if needed

    // For now, we'll use a simple default implementation:
    // - Title: The entire message body
    // - Category: "General"
    // - Tags: []
    const result = await addAccomplishment({
      title: body,
      description: "Added via SMS",
      category: "General",
      tags: ["sms"],
    });

    // Create a TwiML response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    if (result.success) {
      twiml.message("✅ Accomplishment logged! Great job.");
    } else {
      twiml.message("❌ Failed to log accomplishment. Please try again.");
    }

    // Return the TwiML as XML
    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error processing incoming SMS:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
