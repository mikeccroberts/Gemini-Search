import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

export function setupEnvironment() {
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw new Error(
      `Failed to load .env file from ${envPath}: ${result.error.message}`
    );
  }

  // Required environment variables
  const requiredVars = {
    GOOGLE_API_KEYS: process.env.GOOGLE_API_KEYS,
    AUTH_USERNAME: process.env.AUTH_USERNAME,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  };

  // Check for missing variables
  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Parse API keys
  const apiKeys = process.env.GOOGLE_API_KEYS?.split(',').map(key => key.trim()) || [];
  if (apiKeys.length === 0) {
    throw new Error('No valid Google API keys provided');
  }

  return {
    GOOGLE_API_KEYS: apiKeys,
    AUTH_USERNAME: process.env.AUTH_USERNAME,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}
