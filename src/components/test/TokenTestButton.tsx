"use client";

import { useSession, getSession } from "next-auth/react";
import { useState } from "react";
import { useAutoSessionRefresh } from "@/hooks/useAutoSessionRefresh";

export default function TokenTestButton() {
  const { data: session, status } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    isRefreshing: autoRefreshing,
    lastRefreshTime,
    manualRefresh,
  } = useAutoSessionRefresh({
    checkInterval: 20000, // Check every 20 seconds
    refreshBuffer: 45, // Refresh 45 seconds before expiry
    debug: true,
    onRefreshSuccess: (session) =>
      console.log("Auto-refresh success:", session),
    onRefreshError: (error) => console.log("Auto-refresh error:", error),
    onTokenBlacklisted: () =>
      console.log("Token blacklisted - auto refresh stopped"),
  });

  const handleRefreshTest = async () => {
    setIsRefreshing(true);
    console.log("Manually triggering session refresh...");

    try {
      const newSession = await getSession();
      console.log("Session after refresh:", newSession);
    } catch (error) {
      console.error("Session refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAutoRefresh = async () => {
    console.log("Triggering auto-refresh manually...");
    await manualRefresh();
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not authenticated</div>;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Token Test Panel</h3>

      <div className="mb-4 text-sm space-y-1">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Has Access Token:</strong>{" "}
          {session?.accessToken ? "Yes" : "No"}
        </p>
        {/* Removed Has Error: session?.error, as Session type does not have 'error' */}
        <p>
          <strong>Auto-Refreshing:</strong> {autoRefreshing ? "Yes" : "No"}
        </p>
        <p>
          <strong>Last Auto-Refresh:</strong>{" "}
          {new Date(lastRefreshTime).toLocaleTimeString()}
        </p>
      </div>

      <div className="space-x-2">
        <button
          onClick={handleRefreshTest}
          disabled={isRefreshing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing..." : "Manual Refresh"}
        </button>

        <button
          onClick={handleAutoRefresh}
          disabled={autoRefreshing}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {autoRefreshing ? "Auto-Refreshing..." : "Trigger Auto-Refresh"}
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        Auto-refresh runs every 30 seconds and checks if token needs refreshing
        (60s before expiry)
      </p>
    </div>
  );
}
