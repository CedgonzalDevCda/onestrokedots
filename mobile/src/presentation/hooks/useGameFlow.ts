// src/presentation/hooks/useGameFlow.ts
import { useState } from "react";
import { router } from "expo-router";

import { useGame } from "@/src/presentation/hooks/useGame";
import { useLevelNavigation } from "@/src/presentation/hooks/useLevelNavigation";

import { progression } from "@/src/meta/progression/ProgressionService";

import { useInterstitial } from "@/src/infrastructure/ads/useInterstitial";
import { useAds } from "@/src/infrastructure/ads/AdProvider";

import { LevelRuleConfig } from "@/src/core/rules/LevelRuleConfig";

const DEFAULT_RULES: LevelRuleConfig[] = [
  { type: "visit-count" },
  { type: "no-backtrack" },
];

export function useGameFlow(worldId: string, levelId: string) {
  const { getLevel, getNextLevel } = useLevelNavigation();
  const { adMode, canLoadAd } = useAds();
  const { show } = useInterstitial();

  // -------------------------
  // LEVEL (peut être null/undefined, on ne return pas encore)
  // -------------------------
  const level = getLevel(worldId, levelId);

  // Fusion : règles par défaut + règles optionnelles du niveau
  const rules: LevelRuleConfig[] = level
    ? [...DEFAULT_RULES, ...(level.rules ?? [])]
    : DEFAULT_RULES;

  // -------------------------
  // STATE (toujours appelés, avant tout return)
  // -------------------------
  const [showModal, setShowModal] = useState(false);
  const [collectedStars, setCollectedStars] = useState<Record<string, boolean>>(
    {},
  );

  // -------------------------
  // GAME ENGINE (toujours appelé, avec fallback sûr si level absent)
  // -------------------------
  const game = useGame(
    level?.PointList ?? [],
    level?.StarList ?? [],
    collectedStars,
    setCollectedStars,
    rules,
  );

  // -------------------------
  // INPUT HANDLERS
  // -------------------------
  function start(e: any) {
    if (!level) return;
    const { locationX, locationY } = e.nativeEvent;
    game.handleStart(locationX, locationY);
  }

  function move(e: any) {
    if (!level) return;
    const { locationX, locationY } = e.nativeEvent;
    game.handleMove(locationX, locationY);
  }

  function end() {
    if (!level) return;
    handleEndAsync();
  }

  // -------------------------
  // END GAME
  // -------------------------
  async function handleEndAsync() {
    if (!level) return;

    const result = game.handleEnd();
    if (!result.valid) return;

    const starsEarned = Object.values(collectedStars).filter(Boolean).length;

    await progression.completeLevel(level.id, starsEarned);

    if (adMode === "high" && canLoadAd()) {
      show();
      setTimeout(() => setShowModal(true), 300);
    } else {
      setShowModal(true);
    }
  }

  // -------------------------
  // ACTIONS
  // -------------------------
  function retry() {
    setShowModal(false);
    setCollectedStars({});
    game.resetAll();
  }

  function next() {
    if (!level) return;

    const nextLevel = getNextLevel(worldId, levelId);

    if (!nextLevel) {
      router.replace("/worlds");
      return;
    }

    const goNext = () => {
      setShowModal(false);
      setCollectedStars({});
      game.resetAll();

      router.replace({
        pathname: "/play",
        params: {
          worldId,
          levelId: nextLevel.id,
        },
      });
    };

    if (adMode === "high" && canLoadAd()) {
      show();
      setTimeout(goNext, 300);
    } else {
      goNext();
    }
  }

  function home() {
    const goHome = () => {
      setShowModal(false);
      setCollectedStars({});
      game.resetAll();

      router.replace("/(game)/worlds");
    };

    if (adMode === "high" && canLoadAd()) {
      show();
      setTimeout(goHome, 300);
    } else {
      goHome();
    }
  }

  // -------------------------
  // DERIVED
  // -------------------------
  const starsEarned = Object.values(collectedStars).filter(Boolean).length;

  // -------------------------
  // EARLY RETURN — placé après TOUS les hooks
  // -------------------------
  if (!level) return null;

  // -------------------------
  // API
  // -------------------------
  return {
    level,
    gameState: game,
    collectedStars,
    // input
    start,
    move,
    end,
    // ui
    showModal,
    starsEarned,
    lastResult: game.lastResult,
    // actions
    retry,
    next,
    home,
  };
}
