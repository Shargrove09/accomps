import type { NextRequest } from "next/server";
import { Resend } from "resend";

import { addAccomplishment } from "@/lib/actions";
import { ParsedAccomplishment } from "@/lib/types";

// Mark this route as dynamic to prevent static evaluation during build
export const dynamic = "force-dynamic";

// Email webhook handler for Resend.
// - Expects JSON payload from Resend webhook
// - Uses Ollama/agent (optional) to interpret email text
// - Creates an Accomplishment via addAccomplishment
// - Locked down so only a specific email can use it (optional)

const allowedEmail = process.env.ALLOWED_EMAIL;
const defaultCategory = process.env.EMAIL_DEFAULT_CATEGORY ?? "Email";
const agentUrl = process.env.AGENT_EMAIL_URL;
const agentApiKey = process.env.AGENT_API_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Parse Resend webhook payload
    // Expected structure: { type: "email.received", data: { from, to, subject, text, html } }
    if (payload.type !== "email.received") {
      return new Response("Invalid webhook type", { status: 400 });
    }

    const { from, text } = payload.data;
    const body = text?.trim() ?? "";

    // Optional: only accept messages from your own email
    if (allowedEmail && from !== allowedEmail) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!body) {
      await sendConfirmationEmail(from, "Please send a non-empty message.");
      return new Response("OK", { status: 200 });
    }

    const structuredAccomplishment = await parseWithAgent(body);

    const result = await addAccomplishment({
      title: structuredAccomplishment.title,
      description: structuredAccomplishment.description,
      category: structuredAccomplishment.category ?? defaultCategory,
      tags:
        structuredAccomplishment.tags.length > 0
          ? structuredAccomplishment.tags
          : ["email"],
    });

    if (!result.success) {
      await sendConfirmationEmail(from, "Failed to log accomplishment.");
      return new Response("OK", { status: 200 });
    }

    await sendConfirmationEmail(
      from,
      `Logged: ${structuredAccomplishment.title} (category: ${
        structuredAccomplishment.category ?? defaultCategory
      }).`
    );

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error handling Resend email:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function parseWithAgent(message: string): Promise<ParsedAccomplishment> {
  // If no agent is configured, use a simple fallback parser.
  if (!agentUrl || !agentApiKey) {
    return fallbackParse(message);
  }

  try {
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

    if (!res.ok) {
      console.error("Agent returned non-OK status", res.status);
      return fallbackParse(message);
    }

    const data = await res.json();

    // Expecting the agent to return something like:
    // { title: string, description?: string, category?: string, tags?: string[] }
    if (!data || typeof data.title !== "string") {
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
    };
  } catch (error) {
    console.error("Error calling agent from email route:", error);
    return fallbackParse(message);
  }
}

function fallbackParse(message: string): ParsedAccomplishment {
  return {
    title: message,
    description: undefined,
    category: undefined,
    tags: ["email"],
  };
}

async function sendConfirmationEmail(
  to: string,
  message: string
): Promise<void> {
  if (!resendApiKey || !fromEmail) {
    console.warn("Resend not configured, skipping confirmation email");
    return;
  }

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Accomplishment Confirmation",
      text: message,
      html: `<p>${message}</p>`,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
}
