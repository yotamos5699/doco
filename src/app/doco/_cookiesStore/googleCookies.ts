"use server";

import { cookies } from "next/headers";
import { getCachedSession } from "../_google/clients";
type GoogleTokensProps = {
  access_token: string;
  refresh_token: string;
  tokens_expires_at: number;
};

export const getNewTokens = async (refresh_token: string) => {
  return fetch("https://oauth2.googleapis.com/token", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,

      grant_type: "refresh_token",
      refresh_token, // Type assertion
    }),
    method: "POST",
  });
};

export const getGoogleTokens = async (): Promise<GoogleTokensProps> => {
  const store = await cookies();
  let tokens_expires_at = Number(store.get("google_tokens_expires_at")?.value) ?? 0;
  const now = Date.now();

  if (now < tokens_expires_at) {
    tokens_expires_at = await setGoogleTokens({ props: undefined });
  }

  const refresh_token = store.get("google_refresh_token")?.value ?? "";
  const access_token = store.get("google_access_token")?.value ?? "";
  return { refresh_token, access_token, tokens_expires_at };
};
export const setGoogleTokens = async ({ props }: { props: GoogleTokensProps | undefined }) => {
  let access_token = "";
  let refresh_token = "";
  let expires_at = 0;
  const store = await cookies();
  if (props) {
    access_token = props.access_token;
    refresh_token = props.refresh_token;
    expires_at = props.tokens_expires_at;
  } else {
    const now = Date.now();
    const rt = store.get("google_refresh_token");
    const response = await getNewTokens(rt?.value as string);
    const tokens = await response.json();
    access_token = tokens.access_token;
    refresh_token = tokens.refresh_token;
    expires_at = now + tokens.expires_in! * 1000;
  }

  if (props)
    store.set({
      name: "google_refresh_token",
      value: refresh_token,
      httpOnly: true,
      // path: '/',
    });
  store.set({
    name: "google_access_token",
    value: access_token,
    httpOnly: true,
    // path: '/',
  });
  store.set({
    name: "google_tokens_expires_at",
    value: expires_at.toString(),
    httpOnly: true,
    // path: '/',
  });
  await getCachedSession(access_token, refresh_token);
  return expires_at;
};
