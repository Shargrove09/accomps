import type { NextRequest } from "next/server";

import { addAccomplishment } from "@/lib/actions";
import { ParsedAccomplishment } from "@/lib/types";

// Basic SMS webhook handler for Twilio.
// - Expects application/x-www-form-urlencoded body
// - Uses Ollama/agent (optional) to interpret text
// - Creates an Accomplishment via addAccomplishment
// - Locked down so only a specific phone number can use it (optional)

const allowedNumber = process.env.ALLOWED_SMS_NUMBER;
const defaultCategory = process.env.SMS_DEFAULT_CATEGORY ?? "SMS";
const agentUrl = process.env.AGENT_SMS_URL;
const agentApiKey = process.env.AGENT_API_KEY;

export async function POST(req: NextRequest) {
  const bodyText = await req.text();

  // Parse Twilio's URL-encoded body
  const params = new URLSearchParams(bodyText);
  const from = params.get("From") ?? "";
  const body = params.get("Body")?.trim() ?? "";

  // Optional: only accept messages from your own number
  if (allowedNumber && from !== allowedNumber) {
    return new Response("Forbidden", { status: 403 });
  }

  if (!body) {
    return xmlResponse("Please send a non-empty message.");
  }

  try {
    const structuredAccomplishment = await parseWithAgent(body);

    const result = await addAccomplishment({
      title: structuredAccomplishment.title,
      description: structuredAccomplishment.description,
      category: structuredAccomplishment.category ?? defaultCategory,
      tags:
        structuredAccomplishment.tags.length > 0
          ? structuredAccomplishment.tags
          : ["sms"],
    });

    if (!result.success) {
      return xmlResponse("Failed to log accomplishment.");
    }

    return xmlResponse(
      `Logged: ${structuredAccomplishment.title} (category: ${structuredAccomplishment.category ?? defaultCategory}).`
    );
  } catch (error) {
    console.error("Error handling Twilio SMS:", error);
    return xmlResponse("Error while processing your message.");
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
        source: "twilio-sms",
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
    console.error("Error calling agent from SMS route:", error);
    return fallbackParse(message);
  }
}

function fallbackParse(message: string): ParsedAccomplishment {
  return {
    title: message,
    description: undefined,
    category: undefined,
    tags: ["sms"],
  };
}

function xmlResponse(message: string): Response {
  const twiml = `
    <Response>
      <Message>${escapeXml(message)}</Message>
    </Response>
  `.trim();

  return new Response(twiml, {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
