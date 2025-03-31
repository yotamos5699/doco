"use server";
import { google } from "googleapis";

import { cache } from "react";
import { getGoogleTokens } from "../_cookiesStore/googleCookies";

let sessionVersion = 1;
let google_client_initiated = false;
const googleClient = new google.auth.OAuth2();

export const updateCacheVersion = async () => {
  return sessionVersion++;
};

export const getCachedSession = async (access_token: string, refresh_token: string) => {
  // console.log("initiating googleapi session tokens", { version: v });

  const creds = {
    access_token: access_token,
    refresh_token: refresh_token,

    token_type: "Bearer",
  };
  // console.log({ creds });

  googleClient.setCredentials(creds);
  // googleClient.setCredentials({ refresh_token: session?.refreshToken ?? "", access_token: session?.accessToken });
  // return session;
};

const cachedDriveClient = cache((v: number) => google.drive({ version: "v3", auth: googleClient }));

export const getDriveClient = async () => {
  if (!google_client_initiated) {
    const session = await getGoogleTokens();
    await getCachedSession(session.access_token, session.refresh_token);
    google_client_initiated = true;
  }
  return cachedDriveClient(sessionVersion);
};

const cachedGmailClient = cache((v: number) => google.gmail({ version: "v1", auth: googleClient }));

export const getGmailClient = async () => {
  if (!google_client_initiated) {
    const session = await getGoogleTokens();
    await getCachedSession(session.access_token, session.refresh_token);
    google_client_initiated = true;
  }
  // await getCachedSession(sessionVersion);
  return cachedGmailClient(sessionVersion);
};
