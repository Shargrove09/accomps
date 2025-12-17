import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Validate that password was provided
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Check if AUTH_PASSWORD environment variable is set
    if (!process.env.AUTH_PASSWORD) {
      console.error("AUTH_PASSWORD environment variable is not set");
      return NextResponse.json(
        { error: "Authentication is not configured" },
        { status: 500 }
      );
    }

    // Check if AUTH_SESSION_SECRET environment variable is set
    if (!process.env.AUTH_SESSION_SECRET) {
      console.error("AUTH_SESSION_SECRET environment variable is not set");
      return NextResponse.json(
        { error: "Authentication is not configured" },
        { status: 500 }
      );
    }

    // Validate password against environment variable
    if (password !== process.env.AUTH_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Password is correct, set the authentication cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-session", process.env.AUTH_SESSION_SECRET, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // Cookie available across entire site
    });

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
