"use server";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { google } from "googleapis";
import { getServerSession } from "next-auth";

import { cache } from "react";

let sessionVersion = 1;
const googleClient = new google.auth.OAuth2();

export const updateCacheVersion = async () => {
  return sessionVersion++;
};

// interface Session extends Session
export const getCachedSession = cache(async (v: number = sessionVersion) => {
  console.log("initiating googleapi session tokens", { version: v });
  const session = await getServerSession(options);
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

  // console.log({ env_params: process.env });
  console.log("new cached sesssion:", { session, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET });
  const creds = {
    access_token: session?.accessToken,
    // refresh_token: session?.refreshToken,
    // token_type:""
    // expiry_date: session?.accessTokenExpiresAt!,
    // token_type: "Bearer",
  };
  console.log({ creds });

  googleClient.setCredentials(creds);
  // googleClient.setCredentials({ refresh_token: session?.refreshToken ?? "", access_token: session?.accessToken });
  return session;
});
const cachedDriveClient = cache((v: number) => google.drive({ version: "v3", auth: googleClient }));

export const getDriveClient = async () => {
  await getCachedSession(sessionVersion);

  return cachedDriveClient(sessionVersion);
};

const cachedGmailClient = cache((v: number) => google.gmail({ version: "v1", auth: googleClient }));

export const getGmailClient = async () => {
  await getCachedSession(sessionVersion);
  return cachedGmailClient(sessionVersion);
};

// export const getCachedSession = cache(async (v: number = sessionVersion) => {
//   const session = await getServerSession(options);
//   googleClient.setCredentials({
//     access_token: session?.accessToken,
//     refresh_token: session?.refreshToken,
//     expiry_date: session?.expiresAt,
//     token_type: "Bearer",
//   });
//   // googleClient.setCredentials({ refresh_token: session?.refreshToken ?? "", access_token: session?.accessToken });
//   return session;
// });
