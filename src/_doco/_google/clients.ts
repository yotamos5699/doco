"use server";
import { google } from "googleapis";

import { cache } from "react";
import { getGoogleTokens } from "../_cookiesStore/googleCookies";

// const clientId = process.env.GOOGLE_CLIENT_ID!;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
let sessionVersion = 1;
let google_client_initiated = false;
let cached_clients = false;
const googleClient = new google.auth.OAuth2();

export const updateCacheVersion = async () => {
  return sessionVersion++;
};

export const getCachedSession = async (access_token: string, refresh_token: string) => {
  cached_clients = true;
  googleClient.setCredentials({
    access_token: access_token,
    refresh_token: refresh_token,

    token_type: "Bearer",
  });
};

export const initiateGoogleClients = async (is_first?: boolean) => {
  if (!google_client_initiated || !cached_clients || is_first) {
    const session = await getGoogleTokens();
    // console.log({ sessionDataBeforeInitiation: session });
    console.log({ sessionData: session });
    await getCachedSession(session.access_token, session.refresh_token);
    google_client_initiated = true;
    sessionVersion++;
    // return session;
  }

  // return session;
};
const cachedDriveClient = cache((v: number) => google.drive({ version: "v3", auth: googleClient }));
export const getDriveClient = async () => {
  await initiateGoogleClients();
  return cachedDriveClient(sessionVersion);
};

const cachedGmailClient = cache((v: number) => google.gmail({ version: "v1", auth: googleClient }));

export const getGmailClient = async () => {
  await initiateGoogleClients();
  //  await getCachedSession(sessionVersion);
  return cachedGmailClient(sessionVersion);
};
