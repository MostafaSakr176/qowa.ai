"use client";

import { useSession, getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

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

interface SessionMonitorProps {
  /**
   * Interval in milliseconds to check for session refresh
   * Default: 30 seconds (30000ms)
   */
  checkInterval?: number;
  /**
   * How many seconds before token expires to trigger refresh
   * Default: 30 seconds
   */
  refreshBuffer?: number;
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

export default function SessionMonitor({
  checkInterval = 30000, // Check every 30 seconds
  refreshBuffer = 50, // Refresh 50 seconds before expiry (for 1-min tokens)
  debug = false,
}: SessionMonitorProps) {
  const { data: session, status } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const isRefreshing = useRef(false);

  const log = (message: string, data?: unknown) => {
    if (debug) {
      console.log(`[SessionMonitor] ${message}`, data || "");
    }
  };

  const calculateTimeUntilExpiry = (session: ExtendedSession): number => {
    if (!session?.accessToken) return 0;

    // Try to decode JWT to get expiry (basic implementation)
    try {
      const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return expiry - Date.now();
    } catch {
      // Fallback: assume token expires in 1 minute from last refresh
      const assumedExpiry = lastRefresh
        ? lastRefresh.getTime() + 15 * 60 * 1000
        : Date.now() + 15 * 60 * 1000;
      return assumedExpiry - Date.now();
    }
  };

  const shouldRefreshToken = (session: ExtendedSession): boolean => {
    if (!session?.accessToken) return false;

    const timeUntilExpiry = calculateTimeUntilExpiry(session);
    const shouldRefresh = timeUntilExpiry <= refreshBuffer * 1000;

    log(
      `Time until expiry: ${Math.round(
        timeUntilExpiry / 1000
      )}s, Should refresh: ${shouldRefresh}`
    );

    return shouldRefresh;
  };

  const refreshSession = async () => {
    if (isRefreshing.current) {
      log("Refresh already in progress, skipping");
      return;
    }

    isRefreshing.current = true;
    log("Starting automatic session refresh");

    try {
      const newSession = (await getSession()) as ExtendedSession;
      setLastRefresh(new Date());
      log("Session refreshed successfully", {
        hasAccessToken: !!newSession?.accessToken,
        error: newSession?.error,
      });
    } catch (error) {
      log("Session refresh failed", error);
    } finally {
      isRefreshing.current = false;
    }
  };

  const checkAndRefreshSession = async () => {
    if (status === "loading" || status === "unauthenticated") {
      return;
    }

    if (!session) {
      log("No session available");
      return;
    }

    const extendedSession = session as ExtendedSession;
    if (extendedSession.error === "TokenBlacklistedError") {
      log("Token is blacklisted, stopping monitoring");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (shouldRefreshToken(extendedSession)) {
      await refreshSession();
    }
  };

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        log("Page became visible, checking session");
        checkAndRefreshSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [session, status]);

  // Handle window focus
  useEffect(() => {
    const handleFocus = () => {
      log("Window focused, checking session");
      checkAndRefreshSession();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [session, status]);

  // Main monitoring interval
  useEffect(() => {
    if (status === "authenticated" && session) {
      log("Starting session monitoring", {
        checkInterval: checkInterval / 1000 + "s",
        refreshBuffer: refreshBuffer + "s",
      });

      intervalRef.current = setInterval(checkAndRefreshSession, checkInterval);

      // Initial check
      checkAndRefreshSession();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        log("Session monitoring stopped");
      }
    };
  }, [session, status, checkInterval, refreshBuffer, log, checkAndRefreshSession]);

  // Debug component (only shows in debug mode)
  if (debug) {
    return (
      <div className="fixed bottom-4 right-4 p-3 bg-black/80 text-white text-xs rounded-lg max-w-sm">
        <div className="font-bold mb-1">Session Monitor Debug</div>
        <div>Status: {status}</div>
        <div>Has Token: {session?.accessToken ? "Yes" : "No"}</div>
        <div>Error: {(session as ExtendedSession)?.error || "None"}</div>
        <div>Last Refresh: {lastRefresh?.toLocaleTimeString() || "Never"}</div>
        <div>Refreshing: {isRefreshing.current ? "Yes" : "No"}</div>
        {session?.accessToken && (
          <div>
            Expires in: ~
            {Math.round(
              calculateTimeUntilExpiry(session as ExtendedSession) / 1000
            )}
            s
          </div>
        )}
      </div>
    );
  }

  return null; // Component is invisible in production
}
