/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: any) {
    try {
        const formdata = new FormData();
        formdata.append("refresh", token.refreshToken);

        const res = await fetch("https://api.qowa.ai/core/token/refresh/", {
            method: "POST",
            body: formdata,
        });

        const data = await res.json();

        if (!res.ok || !data?.access) throw data;
        const session = {
            ...token,
            accessToken: data.access,
            accessTokenExpires: Date.now() + 15 * 60 * 1000, // 30 دقيقة مثلا
            refreshToken: data.refresh ? data.refresh : token.refreshToken, // 👈 Update refresh
            error: null,
        }

        return session;
    } catch (error) {
        console.error("Refresh token error:", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                otp: { label: "OTP", type: "text" }, // 👈 جديد
              },
              async authorize(credentials) {
                try {
                  const res = await fetch("https://api.qowa.ai/core/login/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: credentials?.email,
                      password: credentials?.password,
                      ...(credentials?.otp ? { otp: credentials.otp } : {}),
                    }),
                  });
              
                  const data = await res.json();
                  
                  console.log();
                  

                  // لو رجع OTP مطلوب
                  if (data?.errors?.non_field_errors?.[0] === "OTP is required for 2FA-enabled accounts" ) {
                    throw new Error("OTP_REQUIRED");
                  }
              
                  if (!res.ok || !data?.tokens?.access) return null;
              
                  return {
                    id: data?.user_id ?? "13",
                    email: credentials?.email,
                    role: data?.role,
                    accessToken: data.tokens.access,
                    refreshToken: data.tokens.refresh,
                  };
                } catch (err) {
                  console.error("Login error:", err);
                  throw err;
                }
              }
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/auth/login",
    },

    callbacks: {
        async jwt({ token, user }) {

            // ✅ أول Login
            if (user) {
                return {
                    ...token,
                    accessToken: (user as any).accessToken,
                    refreshToken: (user as any).refreshToken,
                    role: (user as any).role,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000, // 30 دقيقة
                };
            }

            // ✅ لو لسه صالح
            if (Date.now() < (token.accessTokenExpires as number)) {

                return token;
            }

            // ✅ محتاج refresh
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {

            return {
                ...session,
                user: {
                    ...session.user,
                    role: token.role,
                },
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                error: token.error,
            };
        },
    },
};
