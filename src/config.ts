import dotenv from "dotenv";
import createCookieString from "./utils/createCookieString";

dotenv.config();

const config = {
  status: {
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },
  warmerise: {
    urls: {
      base: process.env.DOMAIN,
      profile: process.env.DOMAIN + "/profile",
      members: process.env.DOMAIN + "/members?displayName=",
      matchmaking: process.env.DOMAIN + "/Warmerise/Matchmaking/",
      join: process.env.DOMAIN + "/join?",
    },
    auth: {
      headers: {
        end4_language: "en",
        end4_locale: "en_US",
        PHPSESSID: process.env.SESSION || "",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    },
  },
  app: {
    token: process.env.DISCORD_TOKEN || "",
    testToken: process.env.DISCORD_TEST_TOKEN || "",
    clientId: process.env.DISCORD_CLIENT_ID || "",
  },
};

export const cookie = createCookieString(config.warmerise.auth.headers);

export default config;
