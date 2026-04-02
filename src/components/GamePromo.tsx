import { Link } from "react-router-dom";
import { Gamepad2, Swords, Trophy, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const GamePromo = () => (
  <section className="terminal-card p-4 sm:p-6 md:p-8 border-t-2 border-t-primary bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
    {/* Pokémon artwork banner */}
    <div className="flex justify-center gap-3 sm:gap-4 mb-4 -mt-1">
      {[25, 6, 9, 150].map(id => (
        <div key={id} className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt={`Pokémon #${id}`}
            className="w-full h-full object-contain drop-shadow-[0_4px_12px_hsl(var(--primary)/0.3)]"
            loading="lazy"
          />
        </div>
      ))}
    </div>

    <div className="space-y-3 text-center sm:text-left">
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <span className="font-mono text-[10px] tracking-widest text-primary uppercase font-bold">
          NEW — PokémonKids Adventure
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
        Choose Your Pokémon.<br />
        <span className="text-primary">Battle. Collect. Win.</span>
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto sm:mx-0">
        Pick your starter, explore adventure zones, battle trainers, answer trivia,
        and collect every Pokémon to become a true Pokémon Master. Cards won add straight
        to your portfolio!
      </p>
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Swords className="w-3 h-3 text-primary" /> Battle System</span>
        <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> 26 Pokémon to collect</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> Knowledge Trivia</span>
        <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-yellow-400" /> Card Wagers</span>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-1">
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

export default GamePromo;
