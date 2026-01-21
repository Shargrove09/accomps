import type { NextRequest } from "next/server";
import { Resend } from "resend";

import { addAccomplishment, createPendingAccomplishment } from "@/lib/actions";
import { ParsedAccomplishment } from "@/lib/types";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

const allowedEmail = process.env.INBOUND_SENDER_WHITELIST;
const defaultCategory = process.env.EMAIL_DEFAULT_CATEGORY ?? "Email";
const agentUrl = process.env.AGENT_EMAIL_URL;
const agentApiKey = process.env.AGENT_API_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;
const configuredConfidenceThreshold = Number(
  process.env.AGENT_CONFIDENCE_THRESHOLD ?? "0.6",
);
const manualReviewThreshold = Number.isFinite(configuredConfidenceThreshold)
  ? configuredConfidenceThreshold
  : 0.6;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log("=== RESEND WEBHOOK RECEIVED ===");
    console.log("Payload type:", payload.type);
    console.log("Full payload:", JSON.stringify(payload, null, 2));

    if (payload.type !== "email.received") {
      console.log("❌ Invalid webhook type:", payload.type);
      return new Response("Invalid webhook type", { status: 400 });
    }

    const { from, email_id, subject } = payload.data;

    console.log("From:", from);
    console.log("Subject:", subject);
    console.log("Email ID:", email_id);
    console.log("Allowed email:", allowedEmail);

    // Validate sender before fetching email content
    if (allowedEmail && from !== allowedEmail) {
      console.log(
        "❌ Forbidden: Email from",
        from,
        "but allowed is",
        allowedEmail,
      );
      return new Response("Forbidden", { status: 403 });
    }

    // Fetch the full email content from Resend using the email_id
    console.log("📧 Fetching email content from Resend...");
    const emailContent = await fetchEmailContent(email_id);

    if (!emailContent) {
      console.log("❌ Failed to fetch email content");
      await sendConfirmationEmail(from, "Failed to retrieve email content.");
      return new Response("Failed to retrieve email content", { status: 502 });
    }

    console.log("Email content retrieved:", {
      hasText: !!emailContent.text,
      hasHtml: !!emailContent.html,
      textLength: emailContent.text?.length || 0,
    });

    // Extract body from either text or HTML (prefer text)
    const body =
      emailContent.text?.trim() ||
      emailContent.html?.replace(/<[^>]*>/g, "").trim() ||
      "";

    console.log("Body preview:", body.substring(0, 100));

    if (!body) {
      console.log("⚠️ Empty body received");
      await sendConfirmationEmail(from, "Please send a non-empty message.");
      return new Response("Empty body", { status: 422 });
    }

    console.log("🤖 Parsing with agent...");
    const structuredAccomplishment = await parseWithAgent(body);
    console.log(
      "Parsed accomplishment:",
      JSON.stringify(structuredAccomplishment, null, 2),
    );

    if (requiresManualReview(structuredAccomplishment)) {
      console.log("⚠️ Low confidence parse detected, queueing for review");
      const queueResult = await createPendingAccomplishment({
        title: structuredAccomplishment.title,
        description: structuredAccomplishment.description,
        category: structuredAccomplishment.category,
        tags: structuredAccomplishment.tags ?? [],
        rawInput: body,
        source: from,
        confidence: structuredAccomplishment.confidence,
        reasoning: structuredAccomplishment.reasoning,
        errorMessage:
          structuredAccomplishment.status === "fallback"
            ? "Parser fallback triggered"
            : undefined,
      });

      if (!queueResult.success) {
        console.log(
          "❌ Failed to queue accomplishment for review:",
          queueResult.error,
        );
        await sendConfirmationEmail(
          from,
          "We received your email but could not enqueue it for review. Please try again later.",
        );
        return new Response("Failed to queue pending accomplishment", {
          status: 500,
        });
      }

      console.log("🗂️ Queued pending accomplishment", queueResult.data?.id);
      await sendConfirmationEmail(
        from,
        `We received your accomplishment but queued it for manual review before it posts. We'll notify you after approval. Reference: ${queueResult.data?.id}`,
      );
      return new Response("Queued for manual review", { status: 202 });
    }

    console.log("💾 Adding to database...");
    const result = await addAccomplishment({
      title: structuredAccomplishment.title,
      description: structuredAccomplishment.description,
      category: structuredAccomplishment.category ?? defaultCategory,
      tags:
        structuredAccomplishment.tags.length > 0
          ? structuredAccomplishment.tags
          : ["email"],
    });

    console.log("Database result:", result);

    if (!result.success) {
      console.log("❌ Failed to add accomplishment:", result.error);
      await sendConfirmationEmail(
        from,
        `Failed to log accomplishment: ${result.error || "Unknown error"}`,
      );
      return new Response("Failed to add accomplishment", { status: 500 });
    }

    console.log("✅ Successfully added accomplishment!");
    await sendConfirmationEmail(
      from,
      `Logged: ${structuredAccomplishment.title} (category: ${
        structuredAccomplishment.category ?? defaultCategory
      }).`,
    );

    return new Response("Accomplishment logged", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling Resend email:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    return new Response("Internal Server Error", { status: 500 });
  }
}

/**
 * Fetches the full email content from Resend using the email_id
 *
 * @param emailId - The unique identifier for the email from Resend
 * @returns Email content with text and html fields, or null if fetch fails
 */
async function fetchEmailContent(
  emailId: string,
): Promise<{ text?: string; html?: string } | null> {
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not configured");
    return null;
  }

  try {
    const resend = new Resend(resendApiKey);

    // Fetch the email using Resend's API
    // Documentation: https://resend.com/docs/api-reference/emails/retrieve-email
    const email = await resend.emails.receiving.get(emailId);

    console.log("Fetched email:", JSON.stringify(email, null, 2));

    return {
      text: email.data?.text || undefined,
      html: email.data?.html || undefined,
    };
  } catch (error) {
    console.error("Error fetching email content from Resend:", error);
    return null;
  }
}

async function parseWithAgent(message: string): Promise<ParsedAccomplishment> {
  // If no agent is configured, use a simple fallback parser.
  if (!agentUrl || !agentApiKey) {
    console.log("⚠️ Agent not configured, using fallback parser");
    console.log("agentUrl:", agentUrl);
    console.log("agentApiKey:", agentApiKey ? "SET" : "NOT SET");
    return fallbackParse(message);
  }

  try {
    console.log("Calling agent at:", agentUrl);
    const res = await fetch(agentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": agentApiKey,
      },
      body: JSON.stringify({
        input: message,
        source: "resend-email",
      }),
    });

    console.log("Agent response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Agent returned non-OK status", res.status, errorText);
      return fallbackParse(message);
    }

    const data = await res.json();
    console.log("Agent response data:", JSON.stringify(data, null, 2));

    if (!data || typeof data.title !== "string") {
      console.log("⚠️ Agent response missing title, using fallback");
      return fallbackParse(message);
    }

    return {
      title: data.title,
      description:
        typeof data.description === "string" ? data.description : undefined,
      category: typeof data.category === "string" ? data.category : undefined,
      tags: Array.isArray(data.tags)
        ? data.tags.filter((t: unknown) => typeof t === "string")
        : [],
      confidence:
        typeof data.confidence === "number"
          ? Math.max(0, Math.min(1, data.confidence))
          : undefined,
      status: typeof data.status === "string" ? data.status : undefined,
      reasoning:
        typeof data.reasoning === "string" ? data.reasoning : undefined,
      raw_input:
        typeof data.raw_input === "string" ? data.raw_input : undefined,
      source: typeof data.source === "string" ? data.source : undefined,
    };
  } catch (error) {
    console.error("Error calling agent from email route:", error);
    return fallbackParse(message);
  }
}

function fallbackParse(message: string): ParsedAccomplishment {
  console.log("📝 Using fallback parser");
  return {
    title: message,
    description: undefined,
    category: undefined,
    tags: ["email"],
    confidence: 0,
    status: "fallback",
    reasoning: "Fallback parser used",
  };
}

async function sendConfirmationEmail(
  to: string,
  message: string,
): Promise<void> {
  if (!resendApiKey || !fromEmail) {
    console.warn("Resend not configured, skipping confirmation email");
    return;
  }

  try {
    console.log("📧 Sending confirmation email to:", to);
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Accomplishment Confirmation",
      text: message,
      html: `<p>${message}</p>`,
    });
    console.log("✅ Confirmation email sent");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}

function requiresManualReview(accomplishment: ParsedAccomplishment): boolean {
  const confidence = accomplishment.confidence ?? 0;
  const status = accomplishment.status ?? "parsed";
  return (
    confidence < manualReviewThreshold ||
    status === "fallback" ||
    status === "low_confidence"
  );
}
