// Stripe product/price mapping — restructured for maximum conversion
// 4 clear tiers: Free → Pro ($9) → Premium ($39) → Team ($99)
export const STRIPE_TIERS = {
  pro: {
    product_id: "prod_UFLCtrgrLTQwAK",
    price_id: "price_1TGqW6PRXT5iryzGS5kcM8bp",
    name: "PRO",
    price: "$9",
    period: "/month",
    annual: {
      product_id: "prod_UFLChD4HzflIqE",
      price_id: "price_1TGqWRPRXT5iryzGwKXzBJSY",
      price: "$90",
      period: "/year",
      savings: "Save $18",
    },
  },
  premium: {
    product_id: "prod_UFLDpPeSbjJBbQ",
    price_id: "price_1TGqWyPRXT5iryzGpyOM63Gr",
    name: "PREMIUM",
    price: "$39",
    period: "/month",
    annual: {
      product_id: "prod_UFLD0mCfO3ckXM",
      price_id: "price_1TGqXUPRXT5iryzG4fcjK3MG",
      price: "$390",
      period: "/year",
      savings: "Save $78",
    },
  },
  team: {
    product_id: "prod_UFLEYH02tl3Kso",
    price_id: "price_1TGqY0PRXT5iryzGzAFma0Wq",
    name: "TEAM",
    price: "$99",
    period: "/month",
    seats: 3,
    annual: {
      product_id: "prod_UFLFdTLL0Xk2qG",
      price_id: "price_1TGqYWPRXT5iryzG6ed5bYvN",
      price: "$990",
      period: "/year",
      savings: "Save $198",
    },
  },
} as const;

// Legacy product IDs for existing subscribers — map to new tier names
const LEGACY_PRODUCT_MAP: Record<string, TierKey> = {
  // Old Pro $19/mo
  "prod_UF3Knh8WvKsjHJ": "pro",
  "prod_UF4CTA2M0ETK0a": "pro",
  // Old Institutional $99/mo → now Premium
  "prod_UF3QB0Bneb91tt": "premium",
  "prod_UF4C2aEY1dOB0J": "premium",
  // Old Trader $99/mo → now Premium
  "prod_UFFxtUeqMcBaWL": "premium",
  "prod_UFFxn9sXi6ag1V": "premium",
  // Old Team $149/mo → now Team
  "prod_UFL2cezPipeaUs": "team",
  "prod_UFL2LEJfzon17Q": "team",
};

export type TierKey = keyof typeof STRIPE_TIERS;

export const getTierByProductId = (productId: string): TierKey | null => {
  // Check current products
  for (const [key, tier] of Object.entries(STRIPE_TIERS)) {
    if (tier.product_id === productId || tier.annual.product_id === productId) return key as TierKey;
  }
  // Check legacy products
  return LEGACY_PRODUCT_MAP[productId] || null;
};
