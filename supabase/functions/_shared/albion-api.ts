const BASE_URL = "https://west.albion-online-data.com";

export interface AodpPrice {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_max: number;
  buy_price_min: number;
  buy_price_max: number;
}

export interface AodpHistory {
  item_id: string;
  location: string;
  quality: number;
  data: { item_count: number; avg_price: number; timestamp: string }[];
}

export async function fetchPrices(itemIds: string[], locations?: string[]): Promise<AodpPrice[]> {
  const itemsParam = itemIds.join(",");
  const locParam = locations ? `&locations=${locations.join(",")}` : "";
  const url = `${BASE_URL}/api/v2/stats/prices/${itemsParam}?qualities=1${locParam}`;
  if (url.length > 4096) throw new Error(`URL too long (${url.length} chars)`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`AODP API error: ${response.status}`);
  return response.json();
}

export async function fetchHistory(itemIds: string[], timeScale: 1 | 6 | 24 = 6, locations?: string[]): Promise<AodpHistory[]> {
  const itemsParam = itemIds.join(",");
  const locParam = locations ? `&locations=${locations.join(",")}` : "";
  const url = `${BASE_URL}/api/v2/stats/history/${itemsParam}?time-scale=${timeScale}${locParam}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`AODP History API error: ${response.status}`);
  return response.json();
}
