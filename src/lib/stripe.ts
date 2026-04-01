// Stripe product/price mapping — 7 tiers for maximum conversion
// Free ($0) → Arena ($0.99) → Starter ($1.99) → Pro ($4.99) → Premium ($9.99) → Team ($19.99) → Whale ($49.99)
export const STRIPE_TIERS = {
  arena: {
    product_id: "prod_UFeyXfI3gOan3o",
    price_id: "price_1TH9eLPRXT5iryzGltaBaKJ9",
    name: "ARENA",
    price: "$0.99",
    period: "/month",
    annual: {
      product_id: "prod_UFeyXfI3gOan3o",
      price_id: "price_1TH9eLPRXT5iryzGltaBaKJ9",
      price: "$0.99",
      period: "/month",
      savings: "",
    },
  },
  starter: {
    product_id: "prod_UFnurafBZwXWY4",
    price_id: "price_1THIIOPRXT5iryzGbKG7blvW",
    name: "STARTER",
    price: "$1.99",
    period: "/month",
    annual: {
      product_id: "prod_UFnvsSe0zB6EAD",
      price_id: "price_1THIJaPRXT5iryzGgxXCmJ40",
      price: "$19.90",
      period: "/year",
      savings: "Save $3.98",
    },
  },
  pro: {
    product_id: "prod_UFnw73TGPp6Ec3",
    price_id: "price_1THIK9PRXT5iryzGmnfehGmM",
    name: "PRO",
    price: "$4.99",
    period: "/month",
    annual: {
      product_id: "prod_UFnw30XbsD15vP",
      price_id: "price_1THIKWPRXT5iryzGYGSuppZa",
      price: "$49.90",
      period: "/year",
      savings: "Save $9.98",
    },
  },
  premium: {
    product_id: "prod_UFnwATMOXq8b6B",
    price_id: "price_1THIKrPRXT5iryzGUTW8e4TB",
    name: "PREMIUM",
    price: "$9.99",
    period: "/month",
    annual: {
      product_id: "prod_UFnxyuQ8fGNYWc",
      price_id: "price_1THILnPRXT5iryzG4li223Cq",
      price: "$99.90",
      period: "/year",
      savings: "Save $19.98",
    },
  },
  team: {
    product_id: "prod_UFnyviY7wZBvQQ",
    price_id: "price_1THIM5PRXT5iryzGTz4mcRWk",
    name: "TEAM",
    price: "$19.99",
    period: "/month",
    seats: 3,
    annual: {
      product_id: "prod_UFny79PBQg6d7F",
      price_id: "price_1THIMYPRXT5iryzGkWNIerLW",
      price: "$199.90",
      period: "/year",
      savings: "Save $39.98",
    },
  },
  whale: {
    product_id: "prod_UFnyxhOFHIQO5k",
    price_id: "price_1THIMwPRXT5iryzGQ1FlyMje",
    name: "WHALE",
    price: "$49.99",
    period: "/month",
    seats: 5,
    annual: {
      product_id: "prod_UFnzWxAELA55Fs",
      price_id: "price_1THINXPRXT5iryzGWVKBxbe4",
      price: "$499.90",
      period: "/year",
      savings: "Save $99.98",
    },
  },
} as const;

// Legacy product IDs for existing subscribers — map to new tier names
const LEGACY_PRODUCT_MAP: Record<string, TierKey> = {
  // Old Starter $4.99/mo → now Starter
  "prod_UFbILYIMFAhdbd": "starter",
  "prod_UFbIN8K7i1sjCg": "starter",
  // Old Pro $9/mo → now Pro
  "prod_UFLCtrgrLTQwAK": "pro",
  "prod_UF3Knh8WvKsjHJ": "pro",
  "prod_UF4CTA2M0ETK0a": "pro",
  "prod_UFLChD4HzflIqE": "pro",
  // Old Premium $39/mo → now Premium
  "prod_UFLDpPeSbjJBbQ": "premium",
  "prod_UFLD0mCfO3ckXM": "premium",
  // Old Institutional $99/mo → now Premium
  "prod_UF3QB0Bneb91tt": "premium",
  "prod_UF4C2aEY1dOB0J": "premium",
  // Old Trader $99/mo → now Premium
  "prod_UFFxtUeqMcBaWL": "premium",
  "prod_UFFxn9sXi6ag1V": "premium",
  // Old Team $99-149/mo → now Team
  "prod_UFLEYH02tl3Kso": "team",
  "prod_UFLFdTLL0Xk2qG": "team",
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
