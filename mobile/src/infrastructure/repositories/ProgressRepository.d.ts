import { PlayerState } from "@/src/meta/progression/PlayerState";

export declare const ProgressRepository: {
  get(): Promise<PlayerState>;
  save(state: PlayerState): Promise<void>;
  reset(): Promise<void>;
};