"use client";
import { useState, useEffect } from "react";
import { apiClient } from "../../../lib/api";

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await apiClient.health.check();
      if (response.data.status === "ok") {
        setApiStatus("API OK");
      } else {
        setApiStatus("API Error");
      }
    } catch (error) {
      console.error("Error checking health:", error);
      setApiStatus("API Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar with Logo */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-900">mtaatek.io</h1>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-700">{apiStatus}</p>
          </div>
        )}
      </main>
    </div>
  );
}
