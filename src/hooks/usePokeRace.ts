import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { rawCards, gradedCards, sealedProducts, type CardData } from "@/data/marketData";

export interface Racer {
  id: string;
  name: string;
  image: string | null;
  category: "raw" | "graded" | "sealed";
  startValue: number;
  currentValue: number;
  changePct: number;
  position: number; // 0-100 track progress
  lane: number;
  odds: number;
}

export interface RaceState {
  id: string;
  type: "sprint" | "championship";
  category: "price" | "inventory";
  status: "active" | "finished";
  racers: Racer[];
  startedAt: number;
  endsAt: number;
  winner: Racer | null;
}

// Deterministic seeded random for consistent race simulation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateOdds = (index: number, total: number): number => {
  // Favorites have lower odds, longshots higher
  const base = 1.5 + (index / total) * 8;
  return Math.round(base * 10) / 10;
};

const pickRacers = (cards: CardData[], count: number, seed: number, category: "raw" | "graded" | "sealed"): Racer[] => {
  const shuffled = [...cards].sort((a, b) => seededRandom(seed + a.market) - seededRandom(seed + b.market));
  return shuffled.slice(0, count).map((card, i) => ({
    id: card._apiId ?? `${card.set}-${card.number}`,
    name: card.name,
    image: card._image ?? null,
    category,
    startValue: card.market,
    currentValue: card.market,
    changePct: 0,
    position: 0,
    lane: i,
    odds: generateOdds(i, count),
  }));
};

export const usePokeRace = () => {
  const [priceRace, setPriceRace] = useState<RaceState | null>(null);
  const [inventoryRace, setInventoryRace] = useState<RaceState | null>(null);
  const animFrame = useRef<number>(0);

  // Generate races based on current 5-minute window
  const initRaces = useCallback(() => {
    const now = Date.now();
    const fiveMin = 5 * 60 * 1000;
    const windowStart = Math.floor(now / fiveMin) * fiveMin;
    const windowEnd = windowStart + fiveMin;
    const seed = windowStart;

    // Pick 5 racers per race from different categories
    const priceRacers = [
      ...pickRacers(rawCards, 2, seed, "raw"),
      ...pickRacers(gradedCards, 2, seed + 1, "graded"),
      ...pickRacers(sealedProducts, 1, seed + 2, "sealed"),
    ].map((r, i) => ({ ...r, lane: i, odds: generateOdds(i, 5) }));

    const invRacers = [
      ...pickRacers(rawCards, 2, seed + 100, "raw"),
      ...pickRacers(gradedCards, 2, seed + 101, "graded"),
      ...pickRacers(sealedProducts, 1, seed + 102, "sealed"),
    ].map((r, i) => ({ ...r, lane: i, odds: generateOdds(i, 5) }));

    setPriceRace({
      id: `price-${windowStart}`,
      type: "sprint",
      category: "price",
      status: "active",
      racers: priceRacers,
      startedAt: windowStart,
      endsAt: windowEnd,
      winner: null,
    });

    setInventoryRace({
      id: `inv-${windowStart}`,
      type: "sprint",
      category: "inventory",
      status: "active",
      racers: invRacers,
      startedAt: windowStart,
      endsAt: windowEnd,
      winner: null,
    });
  }, []);

  // Simulate race progress
  useEffect(() => {
    initRaces();
    const interval = setInterval(initRaces, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [initRaces]);

  // Animate positions
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      
      const updateRace = (race: RaceState | null): RaceState | null => {
        if (!race || race.status === "finished") return race;
        const elapsed = now - race.startedAt;
        const total = race.endsAt - race.startedAt;
        const progress = Math.min(elapsed / total, 1);

        const updatedRacers = race.racers.map((r, i) => {
          // Each racer has a unique movement pattern using seeded randomness
          const racerSeed = race.startedAt + i * 7919;
          const jitter = seededRandom(racerSeed + Math.floor(now / 1000)) * 0.08;
          const basePct = progress * 100;
          // Some racers are faster (based on lane position + randomness)
          const speedFactor = 0.85 + seededRandom(racerSeed) * 0.3;
          const position = Math.min(basePct * speedFactor + jitter * 10, 100);
          const changePct = (seededRandom(racerSeed + Math.floor(now / 5000)) - 0.5) * 10 * progress;
          return { ...r, position, changePct };
        });

        const isFinished = progress >= 1;
        if (isFinished) {
          const sorted = [...updatedRacers].sort((a, b) => b.position - a.position);
          return { ...race, status: "finished" as const, racers: sorted, winner: sorted[0] };
        }

        return { ...race, racers: updatedRacers };
      };

      setPriceRace(prev => updateRace(prev));
      setInventoryRace(prev => updateRace(prev));
      animFrame.current = requestAnimationFrame(animate);
    };

    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  // Time remaining in current race
  const timeRemaining = useMemo(() => {
    if (!priceRace) return 0;
    return Math.max(0, priceRace.endsAt - Date.now());
  }, [priceRace?.endsAt]);

  return {
    priceRace,
    inventoryRace,
    timeRemaining,
    refreshRaces: initRaces,
  };
};
