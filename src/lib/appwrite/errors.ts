import { AppwriteException } from "appwrite";

const FRIENDLY: Record<string, string> = {
  user_already_exists: "An account with that email already exists.",
  user_not_found: "No account found with that email.",
  invalid_credentials: "Incorrect email or password.",
  password_too_short: "Password must be at least 8 characters.",
  user_email_not_whitelisted: "This email is not allowed to sign up.",
  general_access_forbidden:
    "Appwrite Cloud access is restricted. Make sure your Appwrite account email is verified.",
  general_route_not_found:
    "Appwrite resource not found. Check that your database/table IDs in .env.local match what you created in Appwrite.",
  general_argument_invalid:
    "Invalid argument sent to Appwrite. Check your form data and table schema.",
};

export function describeAppwriteError(err: unknown): string {
  if (err instanceof AppwriteException) {
    if (err.message && !err.message.startsWith("<")) {
      return err.message;
    }
    if (err.type && FRIENDLY[err.type]) {
      return FRIENDLY[err.type]!;
    }
    if (err.code === 401) {
      return "Unauthorized. Check your API keys and project permissions.";
    }
    if (err.code === 404) {
      return "Resource not found. Check your database/table IDs in .env.local.";
    }
    if (err.code === 409) {
      return "Conflict: this item already exists.";
    }
    if (err.code >= 500) {
      return "Appwrite server error. Please try again in a moment.";
    }
    return `Appwrite error (${err.code}): ${err.type || "unknown"}`;
  }
  if (err instanceof Error) {
    if (err.message && !err.message.startsWith("<")) {
      return err.message;
    }
    return "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
