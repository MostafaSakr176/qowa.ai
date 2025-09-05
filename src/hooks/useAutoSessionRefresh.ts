"use client";

import { useSession, getSession } from "next-auth/react";
import { useEffect, useRef, useCallback } from "react";

// Extended session type
interface ExtendedSession {
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  expires: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

interface UseAutoSessionRefreshOptions {
  /**
   * Interval in milliseconds to check for session refresh
   * Default: 30 seconds (30000ms)
   */
  checkInterval?: number;
  /**
   * How many seconds before token expires to trigger refresh
   * Default: 60 seconds
   */
  refreshBuffer?: number;
  /**
   * Enable debug logging
   */
  debug?: boolean;
  /**
   * Callback when session is refreshed successfully
   */
  onRefreshSuccess?: (session: ExtendedSession) => void;
  /**
   * Callback when session refresh fails
   */
  onRefreshError?: (error: unknown) => void;
  /**
   * Callback when token is blacklisted
   */
  onTokenBlacklisted?: () => void;
}

export function useAutoSessionRefresh(
  options: UseAutoSessionRefreshOptions = {}
) {
  const {
    checkInterval = 30000, // 30 seconds
    refreshBuffer = 60, // 60 seconds
    debug = false,
    onRefreshSuccess,
    onRefreshError,
    onTokenBlacklisted,
  } = options;

  const { data: session, status } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);
  const lastRefreshTime = useRef<number>(Date.now());

  const log = useCallback(
    (message: string, data?: unknown) => {
      if (debug) {
        console.log(`[useAutoSessionRefresh] ${message}`, data || "");
      }
    },
    [debug]
  );

  const getTokenExpiry = useCallback((accessToken: string): number => {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      // Fallback: assume 15 minutes from last refresh
      return lastRefreshTime.current + 15 * 60 * 1000;
    }
  }, []);

  const shouldRefresh = useCallback(
    (session: ExtendedSession): boolean => {
      if (!session?.accessToken) return false;

      const expiry = getTokenExpiry(session.accessToken);
      const timeUntilExpiry = expiry - Date.now();
      const shouldRefreshNow = timeUntilExpiry <= refreshBuffer * 1000;

      log(
        `Token expires in ${Math.round(
          timeUntilExpiry / 1000
        )}s, should refresh: ${shouldRefreshNow}`
      );

      return shouldRefreshNow;
    },
    [refreshBuffer, log, getTokenExpiry]
  );

  const refreshSession = useCallback(async () => {
    if (isRefreshing.current) {
      log("Refresh already in progress");
      return false;
    }

    isRefreshing.current = true;
    log("Refreshing session automatically");

    try {
      const newSession = (await getSession()) as ExtendedSession;
      lastRefreshTime.current = Date.now();

      if (newSession?.error === "TokenBlacklistedError") {
        log("Token is blacklisted");
        onTokenBlacklisted?.();
        return false;
      }

      if (newSession?.accessToken) {
        log("Session refreshed successfully");
        onRefreshSuccess?.(newSession);
        return true;
      } else {
        throw new Error("No access token in refreshed session");
      }
    } catch (error) {
      log("Session refresh failed", error);
      onRefreshError?.(error);
      return false;
    } finally {
      isRefreshing.current = false;
    }
  }, [log, onRefreshSuccess, onRefreshError, onTokenBlacklisted]);

  const checkSession = useCallback(async () => {
    if (status !== "authenticated" || !session) {
      return;
    }

    const extendedSession = session as ExtendedSession;
    if (extendedSession.error === "TokenBlacklistedError") {
      log("Token blacklisted, stopping auto-refresh");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (shouldRefresh(extendedSession)) {
      await refreshSession();
    }
  }, [status, session, shouldRefresh, refreshSession, log]);

  // Network connectivity check
  const handleOnline = useCallback(() => {
    log("Network connection restored, checking session");
    checkSession();
  }, [checkSession, log]);

  // Page visibility check
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      log("Page became visible, checking session");
      checkSession();
    }
  }, [checkSession, log]);

  // Window focus check
  const handleFocus = useCallback(() => {
    log("Window focused, checking session");
    checkSession();
  }, [checkSession, log]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [handleOnline, handleVisibilityChange, handleFocus]);

  // Main monitoring interval
  useEffect(() => {
    const extendedSession = session as ExtendedSession;
    if (status === "authenticated" && session && !extendedSession.error) {
      log("Starting auto session refresh", {
        interval: `${checkInterval / 1000}s`,
        buffer: `${refreshBuffer}s`,
      });

      // Initial check
      checkSession();

      // Set up interval
      intervalRef.current = setInterval(checkSession, checkInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        log("Auto session refresh stopped");
      }
    };
  }, [status, session, checkInterval, checkSession, log, refreshBuffer]);

  return {
    isRefreshing: isRefreshing.current,
    lastRefreshTime: lastRefreshTime.current,
    manualRefresh: refreshSession,
  };
}
