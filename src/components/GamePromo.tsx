import { Link } from "react-router-dom";
import { Gamepad2, Swords, Trophy, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const POKEMON_SPRITES = [
  { id: 25, name: "Pikachu" },
  { id: 6, name: "Charizard" },
  { id: 9, name: "Blastoise" },
  { id: 150, name: "Mewtwo" },
];

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

const GamePromo = () => {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  return (
    <section className="terminal-card p-4 sm:p-6 border-t-2 border-t-primary bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center mb-2">
        <img src="/icon-192.png" alt="Personal Pulse Engine" className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />
      </div>

      {/* Poké sprites */}
      <div className="flex justify-center gap-4 sm:gap-5 mb-3">
        {POKEMON_SPRITES.map(({ id, name }) => (
          <div key={id} className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 flex-shrink-0 bg-muted/30 rounded-xl flex items-center justify-center border border-border/40">
            {imgErrors[id] ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-[9px] text-muted-foreground text-center">{name}</span>
              </div>
            ) : (
              <img
                src={`${SPRITE_BASE}/${id}.png`}
                alt={name}
                className="w-full h-full object-contain p-1 drop-shadow-[0_2px_6px_hsl(var(--primary)/0.2)]"
                loading="eager"
                onError={() => setImgErrors(prev => ({ ...prev, [id]: true }))}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2.5 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <span className="font-mono text-[10px] tracking-widest text-primary uppercase font-bold">
            NEW — Poké Adventure Land
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-foreground leading-tight">
          Choose Your Poké.{" "}
          <span className="text-primary">Battle. Collect. Win.</span>
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto sm:mx-0">
          Pick your starter, explore adventure zones, battle trainers, answer trivia,
          and collect every Poké to become a true Poké Master. Cards won add straight
          to your portfolio!
        </p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Swords className="w-3 h-3 text-primary" /> Battle System</span>
          <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-secondary" /> 98 Poké to collect</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary" /> Knowledge Trivia</span>
          <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-secondary" /> Card Wagers</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <Link to="/pokemon-kids">
            <Button size="lg" className="w-full sm:w-auto text-sm">
              <Gamepad2 className="w-4 h-4 mr-2" /> Play Free — 3 Battles
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground font-mono">$0.99 to unlock full game</span>
        </div>
      </div>
    </section>
  );
};

export default GamePromo;
