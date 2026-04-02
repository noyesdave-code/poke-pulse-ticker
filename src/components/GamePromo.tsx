import { Link } from "react-router-dom";
import { Gamepad2, Swords, Trophy, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const GamePromo = () => (
  <section className="terminal-card p-6 md:p-8 border-t-2 border-t-primary bg-gradient-to-br from-primary/5 to-transparent">
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <span className="font-mono text-[10px] tracking-widest text-primary uppercase font-bold">
            NEW — PokémonKids Adventure
          </span>
        </div>
        <h3 className="text-2xl font-black text-foreground leading-tight">
          Choose Your Pokémon.<br />
          <span className="text-primary">Battle. Collect. Win.</span>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Pick your starter, explore adventure zones, battle trainers, answer trivia,
          and collect every Pokémon to become a true Pokémon Master. Cards won add straight
          to your portfolio!
        </p>
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Swords className="w-3 h-3 text-primary" /> Battle System</span>
          <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-400" /> 26 Pokémon to collect</span>
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> Knowledge Trivia</span>
          <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-yellow-400" /> Card Wagers</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pokemon-kids">
            <Button size="lg">
              <Gamepad2 className="w-4 h-4 mr-2" /> Play Free — 3 Battles Included
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground font-mono">$0.99 to unlock full game</span>
        </div>
      </div>
      <div className="flex gap-2">
        {[25, 6, 9, 150].map(id => (
          <img
            key={id}
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
            alt="Pokémon"
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  </section>
);

export default GamePromo;
