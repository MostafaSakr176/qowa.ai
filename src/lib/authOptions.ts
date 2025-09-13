/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Global storage for the most recent refresh token - prevents using old tokens
let currentRefreshToken: string | null = null;
// Track invalidated (used) refresh tokens to avoid reuse
const invalidatedRefreshTokens = new Set<string>();

// Global refresh lock to prevent concurrent refresh attempts
let refreshPromise: Promise<any> | null = null;
let isRefreshing = false;

async function refreshAccessToken(token: any) {
  // Always sync with the latest known refresh token if we have one
  if (currentRefreshToken && token.refreshToken !== currentRefreshToken) {
    token.refreshToken = currentRefreshToken;
  }

  // If the token we're about to use was already invalidated, force using currentRefreshToken
  if (invalidatedRefreshTokens.has(token.refreshToken) && currentRefreshToken) {
    token.refreshToken = currentRefreshToken;
  }

  // If a refresh is already in progress, wait for it
  if (isRefreshing) {
    console.log("Refresh already in progress, waiting for completion...");
    if (refreshPromise) {
      return refreshPromise;
    }
  }

  // Set refreshing flag and create the refresh promise
  isRefreshing = true;
  refreshPromise = performRefresh({ ...token, refreshToken: token.refreshToken });

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    // Clear the refresh state when done
    isRefreshing = false;
    refreshPromise = null;
  }
}

// Replace previous performRefresh implementation
async function performRefresh(token: any) {
  try {
    console.log("Starting token refresh with token:", token.refreshToken);

    const oldRefresh = token.refreshToken;

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

    const newAccessToken = data.access || data.tokens?.access;
    const newRefreshToken = data.refresh || data.tokens?.refresh || token.refreshToken;

    if (!newAccessToken) {
      console.error("No access token in refresh response:", data);
      throw new Error("Invalid refresh response");
    }

    // Update global refresh token
    if (newRefreshToken && newRefreshToken !== token.refreshToken) {
      console.log("Updating global refresh token");
      currentRefreshToken = newRefreshToken;
      invalidatedRefreshTokens.add(oldRefresh); // mark old one as invalidated
    }

    const group =
      token.group ||
      (data.access_control &&
        Array.isArray(data.access_control.groups) &&
        data.access_control.groups.length > 0
        ? data.access_control.groups[0]
        : undefined);

    const refreshedToken = {
      ...token,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires: Date.now() + 2 * 60 * 1000,
      group,
      error: null,
    };

    console.log("Token refreshed successfully", {
      hasNewRefreshToken: !!(data.refresh || data.tokens?.refresh),
      expiresAt: new Date(refreshedToken.accessTokenExpires).toISOString(),
      refreshTokenChanged: oldRefresh !== newRefreshToken,
    });

    return refreshedToken;
  } catch (error) {
    console.error("Refresh token error:", error);

    const isTokenBlacklisted =
      error &&
      typeof error === "object" &&
      (("message" in error && error.message === "Token is blacklisted") ||
        ("errors" in error && (error as any).errors?.code === "token_not_valid") ||
        ("detail" in error && (error as any).detail === "Token is blacklisted"));

    if (isTokenBlacklisted) {
      console.log("Token is blacklisted, forcing re-login");
      return {
        ...token,
        group: null,
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
    async jwt({ token, user, trigger }) {
      // Initialize global refresh token on first login
      if (user && (user as any).refreshToken) {
        currentRefreshToken = (user as any).refreshToken;
      }

      // Ensure token.refreshToken is always current
      if (currentRefreshToken && token.refreshToken !== currentRefreshToken) {
        token.refreshToken = currentRefreshToken;
      }

      // Initial login return
      if (user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
            refreshToken: (user as any).refreshToken,
          role: (user as any).role,
          group: (user as any).group,
          accessTokenExpires: Date.now() + 2 * 60 * 1000,
        };
      }

      // Allow manual token updates to sync refreshToken
      if (trigger === "update" && currentRefreshToken) {
        token.refreshToken = currentRefreshToken;
      }

      // If still valid just return (but keep refreshToken synced)
      if (Date.now() < (token.accessTokenExpires as number)) {
        return {
          ...token,
          refreshToken: currentRefreshToken || token.refreshToken,
        };
      }

      console.log("Access token expired, refreshing...");
      const refreshedToken = await refreshAccessToken(token);

      console.log("Using refreshed token:", {
        hasError: !!refreshedToken.error,
        sameRefreshToken: refreshedToken.refreshToken === token.refreshToken,
      });

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
