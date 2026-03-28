import type { CardData, SealedProduct } from "@/data/marketData";

/**
 * Generates a unique, deterministic ticker symbol for any card or sealed product.
 *
 * Format — RAW / GRADED:  NAME-SET#
 *   e.g. CHAR-BS4, UMBR-SKH30, ESPE-P516, LUGA-NG9
 *   Graded cards get a grade suffix: CHAR-BS4·P10, UMBR-SK·C95
 *
 * Format — SEALED:  TYPE-NAME
 *   e.g. BB-BSBB, PK-BSPK, ETB-SVEB
 */

const NAME_MAP: Record<string, string> = {
  charizard: "CHAR",
  pikachu: "PIKA",
  mewtwo: "MEWT",
  blastoise: "BLAS",
  venusaur: "VENU",
  lugia: "LUGA",
  umbreon: "UMBR",
  espeon: "ESPE",
  gengar: "GENG",
  dragonite: "DRAG",
  rayquaza: "RAYQ",
  mew: "MEW",
  eevee: "EEVE",
  snorlax: "SNOR",
  gyarados: "GYAR",
  alakazam: "ALAK",
  machamp: "MACH",
  arcanine: "ARCA",
  tyranitar: "TYRA",
  ho: "HOOH",
  celebi: "CELB",
  latias: "LATI",
  latios: "LATO",
  kyogre: "KYOG",
  groudon: "GROU",
  deoxys: "DEOX",
  jirachi: "JIRA",
  treecko: "TREE",
  mudkip: "MUDK",
  torchic: "TORC",
  gardevoir: "GARD",
  salamence: "SALA",
  metagross: "META",
  suicune: "SUIC",
  entei: "ENTE",
  raikou: "RAIK",
  scizor: "SCIZ",
  steelix: "STEL",
};

const SET_MAP: Record<string, string> = {
  "base set": "BS",
  "base set 2": "B2",
  "jungle": "JU",
  "fossil": "FO",
  "team rocket": "TR",
  "gym heroes": "GH",
  "gym challenge": "GC",
  "neo genesis": "NG",
  "neo discovery": "ND",
  "neo revelation": "NR",
  "neo destiny": "NE",
  "legendary collection": "LC",
  "expedition base set": "EX",
  "aquapolis": "AQ",
  "skyridge": "SK",
  "ruby & sapphire": "RS",
  "sandstorm": "SS",
  "dragon": "DR",
  "hidden legends": "HL",
  "firered & leafgreen": "FL",
  "team rocket returns": "TRR",
  "deoxys": "DEO",
  "emerald": "EM",
  "unseen forces": "UF",
  "delta species": "DS",
  "legend maker": "LM",
  "holon phantoms": "HP",
  "crystal guardians": "CG",
  "dragon frontiers": "DF",
  "power keepers": "PK",
  "pop series 5": "P5",
  "pop series": "PP",
  "promo": "PR",
  "pokémon rumble": "RU",
  "scarlet & violet": "SV",
  "obsidian flames": "OF",
  "paldea evolved": "PE",
  "151": "151",
  "temporal forces": "TF",
  "twilight masquerade": "TM",
  "shrouded fable": "SF",
  "stellar crown": "SC",
  "surging sparks": "SSP",
  "prismatic evolutions": "PEV",
  "journey together": "JT",
};

const GRADE_ABBR: Record<string, string> = {
  "PSA 10": "P10",
  "PSA 9": "P9",
  "PSA 8": "P8",
  "CGC 9.5": "C95",
  "CGC 9": "C9",
  "BGS 9.5": "B95",
  "BGS 10": "B10",
  "TAG 10": "T10",
  "TAG 9": "T9",
};

const SEALED_TYPE: Record<string, string> = {
  "booster box": "BB",
  "booster pack": "PK",
  "etb": "ETB",
  "elite trainer box": "ETB",
  "blister": "BL",
  "theme deck": "TD",
  "collection box": "CB",
  "tin": "TN",
  "bundle": "BN",
};

function abbreviateName(name: string): string {
  const lower = name.toLowerCase().replace(/[^a-z\s]/g, "").trim();
  // Check exact matches first
  for (const [key, abbr] of Object.entries(NAME_MAP)) {
    if (lower.startsWith(key)) return abbr;
  }
  // Fallback: first 4 uppercase consonant-heavy letters
  const clean = lower.replace(/[^a-z]/g, "");
  return clean.slice(0, 4).toUpperCase();
}

function abbreviateSet(set: string): string {
  const lower = set.toLowerCase().trim();
  // Strip edition markers for matching
  const normalized = lower.replace(/\s*1st\s*ed(ition)?\s*/i, "").trim();
  for (const [key, abbr] of Object.entries(SET_MAP)) {
    if (normalized === key || normalized.startsWith(key)) return abbr;
  }
  // Fallback: initials of each word
  return set
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 3);
}

export function getCardToken(card: CardData): string {
  const name = abbreviateName(card.name);
  const set = card.setCode?.toUpperCase() || abbreviateSet(card.set);
  const num = card.number.replace(/[^0-9a-zA-Z]/g, "");

  let token = `${name}-${set}${num}`;

  if (card.grade) {
    const gradeAbbr = GRADE_ABBR[card.grade] || card.grade.replace(/\s/g, "").slice(0, 3).toUpperCase();
    token += `·${gradeAbbr}`;
  }

  return token;
}

export function getSealedToken(product: SealedProduct): string {
  const typeLower = product.type.toLowerCase();
  let typeAbbr = "SL";
  for (const [key, abbr] of Object.entries(SEALED_TYPE)) {
    if (typeLower.includes(key)) {
      typeAbbr = abbr;
      break;
    }
  }

  // Extract set name from product name
  const words = product.name
    .replace(product.type, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const nameAbbr = words
    .map((w) => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 4);

  return `${typeAbbr}-${nameAbbr || "GEN"}`;
}
