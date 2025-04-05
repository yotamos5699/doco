import type { Account, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { getCachedSession, updateCacheVersion } from "@/_doco/_google/clients";
import { setGoogleTokens } from "@/_doco/_cookiesStore/googleCookies";
// import { AdapterUser } from "next-auth/adapters";
// import { updateCacheVersion } from "@/app/(doco)/doco/_google/clients";
// https://gmail.googleapis.com/gmail/
//https://www.googleapis.com/auth/gmail.readonly
// https://mail.google.com/
let google_client_initiated = false;
const scopes = ["https://mail.google.com/", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/calendar"];
const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.photos.readonly",
];

const printLog = true;

let exp_at_cache = 0;
export const options: NextAuthOptions = {
  // session: {
  //   strategy: "jwt",
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          scope:
            "openid email profile https://mail.google.com/ https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar",
          access_type: "offline", // Required for refresh token
          prompt: "consent",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, session, user, account }) {
      // console.log({ infunc_start: token, profile, session });

      // Handle initial login
      // issued_at: 1742203421589,
      // expires_at: null,
      // printLog && console.log({ token, issued_at: token.issued_at, expires_at: token.expires_at, user, account });
      if (account && user) {
        await setGoogleTokens({
          props: {
            access_token: account.access_token ?? "",
            refresh_token: account.refresh_token ?? "",
            tokens_expires_at: (account.expires_at! as number) * 1000,
          },
        });

        const initialToken = {
          ...token,
          access_token: account.access_token,
          // issued_at: now,
          expires_at: (account.expires_at! as number) * 1000,
          refresh_token: account.refresh_token,
          user_id: user.id,
          user,
        };
        console.log({ initialToken });
        return initialToken;
      }

      return token;
      // return { ...token, ...newToken };
      // return { ...newToken };
      // } catch (error) {
      //   return { ...token, error: "RefreshAccessTokenError" as const };
      // }
    },

    async session({ session, token, user }) {
      // printLog && console.log("token in session:", { token, user, ttl: token.expires_at });
      // console.log({ inSession: { token, session } });
      // token.expires_at = 99999;
      if (!google_client_initiated) {
        setGoogleTokens({
          props: undefined,
        });
        google_client_initiated = true;
        console.log("google_client_initiated!! ");
      }
      const updatedSession = {
        // ...token,
        token,
        ...session,
        accessToken: String(token.access_token),
        refreshToken: String(token.refresh_token),
        accessTokenIssuedAt: Number(token.issued_at),
        accessTokenExpiresAt: exp_at_cache,
        //  Number(token.expires_at),
        user_id: token.user_id,
      };
      console.log({ updatedSession });
      return { ...session, ...updatedSession };
    },
  },
};

export type TokenType = {
  token: JWT;
  account: Account | null;
  id?: string;
  name?: string;
};

// callbacks: {
//   async jwt({ token, user, account }) {
//     const now = Date.now();
//     // returning to wrong value
//     const exp = Number(token.expires_at);
//     console.log({ token });
//     console.log({ now, exp, expIn: token?.expires_in });
//     console.log({ remaining: exp - now });
//     if (account && user) {
//       // console.log({ account });
//       return {
//         ...token,
//         access_token: account.access_token,
//         issued_at: Date.now(),
//         expires_at: Number(account.expires_at) * 1000, // 3600 seconds

//         refresh_token: account.refresh_token,
//       };
//     }

//     else if (Number(token.expires_at) > Date.now()) {
//       console.log("token steel fresh !!");
//       return token;
//     } else {
//       console.log("Access token expired getting new one");
//       try {
//         const response = await getNewTokens(token.refresh_token as string)
//         updateCacheVersion().then((version_number) => console.log({ version_number }));
//         const tokens = await response.json();

//         if (!response.ok) throw tokens;

//         const expires_at = Date.now() + tokens.refresh_token_expires_in;

//         // here new value is ok
//         console.log({ expires_at });
//         return {
//           ...token,
//           access_token: tokens.access_token,
//           issued_at: Date.now(),
//           expires_at,
//           refresh_token: tokens.refresh_token ?? token.refresh_token,
//         };

//       } catch (error) {
//         return { ...token, error: "RefreshAccessTokenError" as const };
//       }
//     }
//   },
