// Stripe product/price mapping
export const STRIPE_TIERS = {
  pro: {
    product_id: "prod_UF3Knh8WvKsjHJ",
    price_id: "price_1TGZDOPRXT5iryzGZimtJQq1",
    name: "PRO",
    price: "$19",
    period: "/month",
    annual: {
      product_id: "prod_UF4CTA2M0ETK0a",
      price_id: "price_1TGa44PRXT5iryzGYXslK2r3",
      price: "$190",
      period: "/year",
      savings: "Save $38",
    },
  },
  institutional: {
    product_id: "prod_UF3QB0Bneb91tt",
    price_id: "price_1TGZJWPRXT5iryzGGqxbhF6I",
    name: "INSTITUTIONAL",
    price: "$99",
    period: "/month",
    annual: {
      product_id: "prod_UF4C2aEY1dOB0J",
      price_id: "price_1TGa4NPRXT5iryzGL0RJGIXd",
      price: "$990",
      period: "/year",
      savings: "Save $198",
    },
  },
  trader: {
    product_id: "prod_UFEqR7iWEnj8Za",
    price_id: "price_1TGkMfPRXT5iryzGJdB2ciVt",
    name: "TRADER",
    price: "$499",
    period: "/month",
    annual: {
      product_id: "prod_UFEsWIyr5hyoGV",
      price_id: "price_1TGkOVPRXT5iryzGBrRRJvkF",
      price: "$4,990",
      period: "/year",
      savings: "Save $998",
    },
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;

export const getTierByProductId = (productId: string): TierKey | null => {
  for (const [key, tier] of Object.entries(STRIPE_TIERS)) {
    if (tier.product_id === productId || tier.annual.product_id === productId) return key as TierKey;
  }
  return null;
};
