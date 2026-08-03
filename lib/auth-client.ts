import { createAuthClient } from "better-auth/react"

const getBaseUrl = () => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error(
      `[Missing Environment Variable] NEXT_PUBLIC_APP_URL is not defined in your environment (.env). Please set NEXT_PUBLIC_APP_URL.`
    );
  }
  if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
    throw new Error(
      `[Invalid Environment Variable] NEXT_PUBLIC_APP_URL must start with "http://" or "https://". Received: "${appUrl}"`
    );
  }
  return appUrl;
};


export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});