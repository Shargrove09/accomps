import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  validateAuthConfig,
  validatePassword,
  getSessionSecret,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
} from "@/lib/auth";
import { jsonError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Validate that password was provided
    if (!password) {
      return jsonError("Password is required", 400);
    }

    // Check that required env vars are configured
    const config = validateAuthConfig();
    if (!config.isValid) {
      console.error(
        "Missing auth environment variables:",
        config.missingVars.join(", ")
      );
      return jsonError("Authentication is not configured", 500);
    }

    // Validate password against environment variable
    if (!validatePassword(password)) {
      return jsonError("Invalid password", 401);
    }

    // Password is correct, set the authentication cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, getSessionSecret()!, AUTH_COOKIE_OPTIONS);

    return NextResponse.json(
      { success: true, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return jsonError("An error occurred during login", 500, error);
  }
}
