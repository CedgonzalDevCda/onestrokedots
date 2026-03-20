import React, { createContext, useContext, useRef, useState } from "react";

export type AdMode = "normal" | "high" | "no_ads";

type AdContextType = {
  adMode: AdMode;
  setAdMode: (mode: AdMode) => void;
  canLoadAd: () => boolean;
};

const AdContext = createContext<AdContextType | null>(null);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lastLoad = useRef<number>(0);
  const [adMode, setAdMode] = useState<AdMode>("normal");

  const canLoadAd = () => {
    const now = Date.now();
    if (now - lastLoad.current < 30000) return false;

    lastLoad.current = now;
    return true;
  };

  return (
    <AdContext.Provider value={{ adMode, setAdMode, canLoadAd }}>
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
