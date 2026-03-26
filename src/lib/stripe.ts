// Stripe product/price mapping
export const STRIPE_TIERS = {
  pro: {
    product_id: "prod_UDfwrL5oau6Y6q",
    price_id: "price_1TFEad2eZvKYlo2C49HWwcEF",
    name: "PRO",
    price: "$19",
    period: "/month",
  },
  institutional: {
    product_id: "prod_UDfx3uMmVicbGH",
    price_id: "price_1TFEbE2eZvKYlo2C4c8TGUoC",
    name: "INSTITUTIONAL",
    price: "$99",
    period: "/month",
  },
} as const;

export type TierKey = keyof typeof STRIPE_TIERS;

export const getTierByProductId = (productId: string): TierKey | null => {
  for (const [key, tier] of Object.entries(STRIPE_TIERS)) {
    if (tier.product_id === productId) return key as TierKey;
  }
  return null;
};
