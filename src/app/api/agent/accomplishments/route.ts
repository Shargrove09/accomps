import { NextResponse } from "next/server";
import { addAccomplishment } from "@/lib/actions";

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  // Simple API Key authentication
  if (apiKey !== process.env.AGENT_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, category, tags } = body;

    if (!title || !category || !Array.isArray(tags)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, category, and tags (as an array)",
        },
        { status: 400 }
      );
    }

    const result = await addAccomplishment({
      title,
      description,
      category,
      tags,
    });

    return NextResponse.json({
      message: "Accomplishment added successfully",
      accomplishmentId: result.id,
    });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to add accomplishment", details: errorMessage },
      { status: 500 }
    );
  }
}
