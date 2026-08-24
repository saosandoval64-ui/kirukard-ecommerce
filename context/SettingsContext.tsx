"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface SettingsContextValue {
  settings: Record<string, string>;
  getSetting: (key: string, fallback?: string) => string;
  loading: boolean;
  refetchSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: {},
  getSetting: (_key, fallback) => fallback ?? "",
  loading: true,
  refetchSettings: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    intervalRef.current = setInterval(fetchSettings, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchSettings]);

  const getSetting = (key: string, fallback = "") => settings[key] ?? fallback;

  return (
    <SettingsContext.Provider value={{ settings, getSetting, loading, refetchSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
