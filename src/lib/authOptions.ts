/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import toast from "react-hot-toast";

// Global refresh lock to prevent concurrent refresh attempts
let refreshPromise: Promise<any> | null = null;

async function refreshAccessToken(token: any) {
  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    console.log("Refresh already in progress, waiting...");
    return refreshPromise;
  }

  // Create the refresh promise
  refreshPromise = performRefresh(token);

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    // Clear the promise when done
    refreshPromise = null;
  }
}

async function performRefresh(token: any) {
  try {
    console.log(
      "Starting token refresh with token:",
      token.refreshToken
    );

    const formdata = new FormData();
    formdata.append("refresh", token.refreshToken);

    const res = await fetch("https://api.qowa.ai/core/token/refresh/", {
      method: "POST",
      body: formdata,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Token refresh failed:", data);
      throw data;
    }

    // Handle both possible response structures
    const newAccessToken = data.access || data.tokens?.access;
    const newRefreshToken =
      data.refresh || data.tokens?.refresh || token.refreshToken;

    if (!newAccessToken) {
      console.error("No access token in refresh response:", data);
      throw new Error("Invalid refresh response");
    }

    // Try to preserve group in token if present
    const group =
      token.group ||
      (data.access_control &&
        Array.isArray(data.access_control.groups) &&
        data.access_control.groups.length > 0
        ? data.access_control.groups[0]
        : undefined);

    const session = {
      user: token.user,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      // Set expiration to 15 minutes for testing token refresh flow
      accessTokenExpires: Date.now() + 2 * 60 * 1000,
      role: token.role,
      group: group,
      error: null,
    };

    console.log("Token refreshed successfully", {
      hasNewRefreshToken: !!data.refresh || !!data.tokens?.refresh,
      expiresAt: new Date(session.accessTokenExpires).toISOString(),
      newRefreshToken: newRefreshToken?.substring(0, 20) + "...",
    });

    return session;
  } catch (error) {
    console.error("Refresh token error:", error);

    // Check if token is blacklisted or invalid
    const isTokenBlacklisted =
      error &&
      typeof error === "object" &&
      (("message" in error && error.message === "Token is blacklisted") ||
        ("errors" in error &&
          (error.errors as any)?.code === "token_not_valid") ||
        ("detail" in error &&
          (error as any).detail === "Token is blacklisted"));

    if (isTokenBlacklisted) {
      console.log("Token is blacklisted, forcing re-login");
      return {
        ...token,
        group:null,
        error: "TokenBlacklistedError",
        accessToken: null,
        refreshToken: null,

      };
    }

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
        otp: { label: "OTP", type: "text" },
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

          console.log(data);
          
          // Handle OTP requirement
          if (
            data?.errors?.non_field_errors?.[0] ===
            "OTP is required for 2FA-enabled accounts"
          ) {
            throw new Error("OTP_REQUIRED");
          }

          if (!res.ok || !data?.tokens?.access) {
            console.error("Login failed: " + JSON.stringify(data));
            return null;
          }

          // Extract the first group from access_control.groups if available
          const group =
            data?.access_control &&
            Array.isArray(data.access_control.groups) &&
            data.access_control.groups.length > 0
              ? data.access_control.groups[0]
              : undefined;

          return {
            id: data?.user_id ?? "13",
            email: credentials?.email ?? "",
            role: data?.role,
            accessToken: data.tokens.access,
            refreshToken: data.tokens.refresh,
            group: group,
          };
        } catch (err) {
          console.error("Login error:" + err);
          throw err;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login",
  },

  events: {
    async signOut() {
      // Clear any stored tokens when signing out
      console.log("User signed out, clearing tokens");
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial login
      if (user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          role: (user as any).role,
          group: (user as any).group,
          // Set expiration to 15 minutes for testing token refresh flow
          accessTokenExpires: Date.now() + 2 * 60 * 1000,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      const refreshedToken = await refreshAccessToken(token);

      // If refresh failed, handle different error types
      if (refreshedToken.error) {
        if (refreshedToken.error === "TokenBlacklistedError") {
          console.log("Token blacklisted, clearing session");
          // Return a token that will force sign out
          return {
            ...token,
            error: "TokenBlacklistedError",
            accessToken: null,
            refreshToken: null,
          };
        } else {
          console.error("Token refresh failed, user needs to re-login");
          return refreshedToken;
        }
      }

      return refreshedToken;
    },

    async session({ session, token }) {
      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
        },
        group: token.group,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        error: token.error,
      };
    },
  },
};
