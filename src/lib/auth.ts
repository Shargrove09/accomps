/**
 * Authentication utility functions and types
 */

export type AuthResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge: number;
  path: string;
};

/**
 * Default cookie options for authentication
 */
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // CSRF protection while allowing normal navigation
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  path: "/", // Cookie available across entire site
};

/**
 * Cookie name for authentication session
 */
export const AUTH_COOKIE_NAME = "auth-session";

/**
 * Validates that required environment variables are set
 */
export function validateAuthConfig(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = ["AUTH_PASSWORD", "AUTH_SESSION_SECRET"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

/**
 * Validates a password against the configured AUTH_PASSWORD
 */
export function validatePassword(password: string): boolean {
  if (!password || !process.env.AUTH_PASSWORD) {
    return false;
  }

  return password === process.env.AUTH_PASSWORD;
}

/**
 * Gets the session secret for cookie signing
 */
export function getSessionSecret(): string | undefined {
  return process.env.AUTH_SESSION_SECRET;
}
