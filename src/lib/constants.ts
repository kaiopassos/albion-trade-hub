export const CITIES = [
  "Bridgewatch",
  "Fort Sterling",
  "Lymhurst",
  "Martlock",
  "Thetford",
  "Caerleon",
  "Brecilien",
] as const;

export type City = (typeof CITIES)[number];

export const MARKET_TAX_RATE = 0.065;
export const PREMIUM_MARKET_TAX_RATE = 0.045;

export const FLIP_TYPES = ["city", "time", "craft"] as const;
export type FlipType = (typeof FLIP_TYPES)[number];

export const AODP_BASE_URL = "https://west.albion-online-data.com";
export const AODP_PRICES_ENDPOINT = "/api/v2/stats/prices";
export const AODP_HISTORY_ENDPOINT = "/api/v2/stats/history";

export const PREMIUM_COST_SILVER = 9_000_000;

export const ITEM_CATEGORIES = [
  "weapon", "armor", "accessory", "consumable",
  "material", "resource", "mount", "furniture",
  "farmable", "other",
] as const;

export const TIER_LABELS: Record<number, string> = {
  1: "T1 - Beginner", 2: "T2 - Novice", 3: "T3 - Journeyman",
  4: "T4 - Adept", 5: "T5 - Expert", 6: "T6 - Master",
  7: "T7 - Grandmaster", 8: "T8 - Elder",
};
