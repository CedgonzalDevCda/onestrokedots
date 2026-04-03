import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";

export type AdMode = "normal" | "high" | "no_ads";

type AdContextType = {
  adMode: AdMode;
  setAdMode: (mode: AdMode) => void;
  canLoadAd: () => boolean;
  adsReady: boolean;
};

const AdContext = createContext<AdContextType | null>(null);

let initialized = false;

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lastLoad = useRef<number>(0);
  const [adMode, setAdMode] = useState<AdMode>("normal");
  const [adsReady, setAdsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initAds = async () => {
      if (!initialized) {
        try {
          await Promise.race([
            mobileAds().initialize(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 3000)
            ),
          ]);

          initialized = true;
          console.log("✅ AdMob initialized");
        } catch (e) {
          console.log("❌ AdMob init failed", e);
        }
      }

      if (!cancelled) setAdsReady(true);
    };

    initAds();

    return () => {
      cancelled = true;
    };
  }, []);

  const canLoadAd = () => {
    if (!adsReady) return false;

    const now = Date.now();
    if (now - lastLoad.current < 30000) return false;

    lastLoad.current = now;
    return true;
  };

  return (
    <AdContext.Provider value={{ adMode, setAdMode, canLoadAd, adsReady }}>
      {children}
    </AdContext.Provider>
  );
};

export const useAds = (): AdContextType => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error("useAds must be used within AdProvider");
  }
  return context;
};
