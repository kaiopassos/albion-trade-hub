import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/* eslint-disable @typescript-eslint/no-explicit-any */

function extractItems(obj: any): any[] {
  const result: any[] = [];
  const data = obj?.items;
  if (!data) return result;

  const categories = [
    "equipmentitem", "weapon", "simpleitem", "consumableitem",
    "farmableitem", "mountitem", "furnitureitem", "journalitem",
    "trackingitem", "hideoutitem", "crystalleagueitem",
  ];

  for (const cat of categories) {
    const entries = data[cat];
    if (Array.isArray(entries)) {
      result.push(...entries);
    } else if (entries && typeof entries === "object") {
      result.push(entries);
    }
  }

  return result;
}

function categorize(id: string): string {
  if (id.includes("_ORE") || id.includes("_HIDE") || id.includes("_FIBER") || id.includes("_WOOD") || id.includes("_ROCK")) return "resource";
  if (id.includes("_METALBAR") || id.includes("_LEATHER") || id.includes("_CLOTH") || id.includes("_PLANKS") || id.includes("_STONEBLOCK")) return "material";
  if (id.includes("_MAIN_") || id.includes("_2H_") || id.includes("_OFF_")) return "weapon";
  if (id.includes("_HEAD_") || id.includes("_ARMOR_") || id.includes("_SHOES_")) return "armor";
  if (id.includes("_BAG") || id.includes("_CAPE")) return "accessory";
  if (id.includes("_MOUNT_") || id.includes("MOUNT")) return "mount";
  if (id.includes("_POTION_") || id.includes("_MEAL_") || id.includes("_STEW") || id.includes("_SALAD") || id.includes("_PIE") || id.includes("_SANDWICH") || id.includes("_OMELETTE") || id.includes("_SOUP")) return "consumable";
  if (id.includes("_FARM") || id.includes("_SEED") || id.includes("_GROWN")) return "farmable";
  return "other";
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${SUPABASE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const response = await fetch(
      "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/items.json"
    );
    if (!response.ok) throw new Error(`Failed to fetch items: ${response.status}`);

    const rawData = await response.json();
    const rawItems = extractItems(rawData);

    const parsed: { id: string; name: string; tier: number; enchantment: number; category: string; subcategory: string }[] = [];

    for (const item of rawItems) {
      const id = item["@uniquename"];
      if (!id || id.startsWith("UNIQUE_") || id.startsWith("TEST_")) continue;

      const tierMatch = id.match(/^T(\d)/);
      const tier = tierMatch ? parseInt(tierMatch[1]) : parseInt(item["@tier"] || "0");
      if (tier < 3) continue; // Only T3+

      const enchMatch = id.match(/@(\d)$/);
      const enchantment = enchMatch ? parseInt(enchMatch[1]) : 0;
      const category = categorize(id);
      const subcategory = item["@shopsubcategory1"] || "";

      parsed.push({ id, name: id, tier, enchantment, category, subcategory });
    }

    let upserted = 0;
    for (let i = 0; i < parsed.length; i += 500) {
      const batch = parsed.slice(i, i + 500);
      const { error } = await supabase.from("items").upsert(batch, { onConflict: "id" });
      if (!error) upserted += batch.length;
    }

    return NextResponse.json({ success: true, upserted, total_raw: rawItems.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
