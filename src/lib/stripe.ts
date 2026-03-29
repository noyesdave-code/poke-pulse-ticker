// Stripe product/price mapping
export const STRIPE_TIERS = {
  pro: {
    product_id: "prod_UDfwrL5oau6Y6q",
    price_id: "price_1TFEad2eZvKYlo2C49HWwcEF",
    name: "PRO",
    price: "$19",
    period: "/month",
    annual: {
      product_id: "prod_UEbA2A9PThq2jK",
      price_id: "price_1TG7xk2eZvKYlo2CcAOL7J8G",
      price: "$190",
      period: "/year",
      savings: "Save $38",
    },
  },
  institutional: {
    product_id: "prod_UDfx3uMmVicbGH",
    price_id: "price_1TFEbE2eZvKYlo2C4c8TGUoC",
    name: "INSTITUTIONAL",
    price: "$99",
    period: "/month",
    annual: {
      product_id: "prod_UEbAKSKs8Pcgrq",
      price_id: "price_1TG7ya2eZvKYlo2CEZJlFjjL",
      price: "$990",
      period: "/year",
      savings: "Save $198",
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
