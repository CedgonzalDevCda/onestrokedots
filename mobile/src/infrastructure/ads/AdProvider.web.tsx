import React, { createContext, useContext, useState } from "react";
import type { AdMode, AdContextType } from "./types";

export type { AdMode, AdContextType };

const AdContext = createContext<AdContextType | null>(null);

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adMode, setAdMode] = useState<AdMode>("no_ads");

  return (
    <AdContext.Provider
      value={{
        adMode,
        setAdMode,
        canLoadAd: () => false,
        adsReady: false,
      }}
    >
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