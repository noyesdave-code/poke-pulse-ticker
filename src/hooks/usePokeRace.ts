import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { rawCards, gradedCards, sealedProducts, type CardData, type SealedProduct } from "@/data/marketData";

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

export type RacePhase = "racing" | "freeze" | "betting";
export type ActiveTrack = "price" | "inventory";

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

export interface CycleState {
  phase: RacePhase;
  activeTrack: ActiveTrack;
  phaseEndsAt: number;
  raceNumber: number;
}

// Deterministic seeded random for consistent race simulation
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateOdds = (index: number, total: number): number => {
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

const pickSealedRacers = (products: SealedProduct[], count: number, seed: number): Racer[] => {
  const shuffled = [...products].sort((a, b) => seededRandom(seed + a.market) - seededRandom(seed + b.market));
  return shuffled.slice(0, count).map((p, i) => ({
    id: `sealed-${p.name.replace(/\s+/g, "-").toLowerCase()}`,
    name: p.name,
    image: null,
    category: "sealed" as const,
    startValue: p.market,
    currentValue: p.market,
    changePct: 0,
    position: 0,
    lane: i,
    odds: generateOdds(i, count),
  }));
};

const RACE_DURATION = 2 * 60 * 1000; // 2 minutes
const FREEZE_DURATION = 10 * 1000;   // 10 seconds freeze after race
const BET_DURATION = 1 * 60 * 1000;  // 1 minute betting (after freeze)
const HALF_CYCLE = RACE_DURATION + FREEZE_DURATION + BET_DURATION; // 3m10s per half-cycle

export const usePokeRace = () => {
  const [priceRace, setPriceRace] = useState<RaceState | null>(null);
  const [inventoryRace, setInventoryRace] = useState<RaceState | null>(null);
  const [cycle, setCycle] = useState<CycleState>({
    phase: "racing",
    activeTrack: "inventory",
    phaseEndsAt: 0,
    raceNumber: 0,
  });
  const animFrame = useRef<number>(0);

  // Compute cycle state from current time
  const computeCycle = useCallback((): CycleState => {
    const now = Date.now();
    // Full cycle: inv race 2m + freeze 10s + bet 1m + price race 2m + freeze 10s + bet 1m
    const fullCycle = HALF_CYCLE * 2;
    const cycleStart = Math.floor(now / fullCycle) * fullCycle;
    const elapsed = now - cycleStart;

    let phase: RacePhase;
    let activeTrack: ActiveTrack;
    let phaseEndsAt: number;

    const raceEnd1 = RACE_DURATION;
    const freezeEnd1 = raceEnd1 + FREEZE_DURATION;
    const betEnd1 = freezeEnd1 + BET_DURATION;
    const raceEnd2 = betEnd1 + RACE_DURATION;
    const freezeEnd2 = raceEnd2 + FREEZE_DURATION;

    if (elapsed < raceEnd1) {
      phase = "racing";
      activeTrack = "inventory";
      phaseEndsAt = cycleStart + raceEnd1;
    } else if (elapsed < freezeEnd1) {
      phase = "freeze";
      activeTrack = "inventory";
      phaseEndsAt = cycleStart + freezeEnd1;
    } else if (elapsed < betEnd1) {
      phase = "betting";
      activeTrack = "price";
      phaseEndsAt = cycleStart + betEnd1;
    } else if (elapsed < raceEnd2) {
      phase = "racing";
      activeTrack = "price";
      phaseEndsAt = cycleStart + raceEnd2;
    } else if (elapsed < freezeEnd2) {
      phase = "freeze";
      activeTrack = "price";
      phaseEndsAt = cycleStart + freezeEnd2;
    } else {
      phase = "betting";
      activeTrack = "inventory";
      phaseEndsAt = cycleStart + fullCycle;
    }

    const raceNumber = Math.floor(now / HALF_CYCLE);

    return { phase, activeTrack, phaseEndsAt, raceNumber };
  }, []);

  // Build race for a given track
  const buildRace = useCallback((track: ActiveTrack, seed: number, startedAt: number, endsAt: number): RaceState => {
    const offset = track === "price" ? 0 : 100;
    const racers = [
      ...pickRacers(rawCards, 2, seed + offset, "raw"),
      ...pickRacers(gradedCards, 2, seed + offset + 1, "graded"),
      ...pickSealedRacers(sealedProducts, 1, seed + offset + 2),
    ].map((r, i) => ({ ...r, lane: i, odds: generateOdds(i, 5) }));

    return {
      id: `${track}-${seed}`,
      type: "sprint",
      category: track,
      status: "active",
      racers,
      startedAt,
      endsAt,
      winner: null,
    };
  }, []);

  // Initialize/update races based on cycle
  const syncRaces = useCallback(() => {
    const c = computeCycle();
    setCycle(c);

    const now = Date.now();
    const fullCycle = CYCLE_DURATION * 2;
    const cycleStart = Math.floor(now / fullCycle) * fullCycle;
    const seed = cycleStart;

    // Build inventory race (first half)
    const invStart = cycleStart;
    const invEnd = cycleStart + RACE_DURATION;
    const invRace = buildRace("inventory", seed, invStart, invEnd);

    // Build price race (second half)
    const priceStart = cycleStart + CYCLE_DURATION;
    const priceEnd = cycleStart + CYCLE_DURATION + RACE_DURATION;
    const priceRaceData = buildRace("price", seed + 50, priceStart, priceEnd);

    setPriceRace(priceRaceData);
    setInventoryRace(invRace);
  }, [computeCycle, buildRace]);

  useEffect(() => {
    syncRaces();
    // Re-sync at every cycle boundary
    const interval = setInterval(syncRaces, 5000);
    return () => clearInterval(interval);
  }, [syncRaces]);

  // Animate positions
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const c = computeCycle();
      setCycle(c);

      const updateRace = (race: RaceState | null): RaceState | null => {
        if (!race) return race;

        // Only animate if currently racing this track
        const isCurrentlyRacing = c.phase === "racing" && c.activeTrack === race.category;
        
        if (!isCurrentlyRacing) {
          // If race time has passed, show finished state
          if (now >= race.endsAt && race.status !== "finished") {
            const finalRacers = race.racers.map((r, i) => {
              const racerSeed = race.startedAt + i * 7919;
              const speedFactor = 0.85 + seededRandom(racerSeed) * 0.3;
              const position = Math.min(100 * speedFactor + seededRandom(racerSeed + 999) * 5, 100);
              const changePct = (seededRandom(racerSeed + 500) - 0.5) * 10;
              return { ...r, position, changePct };
            });
            const sorted = [...finalRacers].sort((a, b) => b.position - a.position);
            return { ...race, status: "finished" as const, racers: sorted, winner: sorted[0] };
          }
          return race;
        }

        if (race.status === "finished") return race;

        const elapsed = now - race.startedAt;
        const total = race.endsAt - race.startedAt;
        const progress = Math.min(elapsed / total, 1);

        const updatedRacers = race.racers.map((r, i) => {
          const racerSeed = race.startedAt + i * 7919;
          const jitter = seededRandom(racerSeed + Math.floor(now / 800)) * 0.08;
          const basePct = progress * 100;
          const speedFactor = 0.85 + seededRandom(racerSeed) * 0.3;
          const position = Math.min(basePct * speedFactor + jitter * 12, 100);
          const changePct = (seededRandom(racerSeed + Math.floor(now / 3000)) - 0.5) * 10 * progress;
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
  }, [computeCycle]);

  // Time remaining in current phase
  const phaseTimeRemaining = useMemo(() => {
    return Math.max(0, cycle.phaseEndsAt - Date.now());
  }, [cycle.phaseEndsAt]);

  return {
    priceRace,
    inventoryRace,
    cycle,
    phaseTimeRemaining,
    refreshRaces: syncRaces,
  };
};
