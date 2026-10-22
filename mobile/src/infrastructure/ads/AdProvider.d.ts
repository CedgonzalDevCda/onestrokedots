import type React from "react";
import type { AdMode, AdContextType } from "./types";

export type { AdMode, AdContextType };
export declare const AdProvider: React.FC<{ children: React.ReactNode }>;
export declare const useAds: () => AdContextType;