import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface RawItem {
  "@uniquename"?: string;
  "@shopcategory"?: string;
  "@shopsubcategory1"?: string;
  "@tier"?: string;
  "@enchantmentlevel"?: string;
}

function extractItems(obj: Record<string, unknown>): RawItem[] {
  const items: RawItem[] = [];
  const categories = [
    "equipmentitem", "weapon", "simpleitem", "consumableitem",
    "farmableitem", "mountitem", "furnitureitem", "journalitem",
    "trackingitem", "hideoutitem", "crystalleagueitem", "rewardtoken",
    "consumablefrominventoryitem", "killtrophy",
  ];

  const data = obj.items as Record<string, unknown>;
  if (!data) return items;

  for (const cat of categories) {
    const entries = data[cat];
    if (Array.isArray(entries)) {
      items.push(...entries);
    } else if (entries && typeof entries === "object") {
      items.push(entries as RawItem);
    }
  }

  return items;
}

function categorize(id: string): string {
  if (id.includes("_ORE") || id.includes("_HIDE") || id.includes("_FIBER") || id.includes("_WOOD") || id.includes("_ROCK") || id.includes("_STONEBLOCK")) return "resource";
  if (id.includes("_METALBAR") || id.includes("_LEATHER") || id.includes("_CLOTH") || id.includes("_PLANKS")) return "material";
  if (id.includes("_MAIN_") || id.includes("_2H_") || id.includes("_OFF_") || id.includes("_SWORD") || id.includes("_BOW") || id.includes("_CROSSBOW") || id.includes("_STAFF") || id.includes("_AXE") || id.includes("_MACE") || id.includes("_HAMMER") || id.includes("_SPEAR") || id.includes("_DAGGER") || id.includes("_QUARTERSTAFF") || id.includes("_CURSED") || id.includes("_FIRE") || id.includes("_FROST") || id.includes("_ARCANE") || id.includes("_HOLY") || id.includes("_NATURE")) return "weapon";
  if (id.includes("_HEAD_") || id.includes("_ARMOR_") || id.includes("_SHOES_") || id.includes("_HELM_") || id.includes("_PLATE") || id.includes("_LEATHER_") || id.includes("_CLOTH_")) return "armor";
  if (id.includes("_BAG") || id.includes("_CAPE")) return "accessory";
  if (id.includes("_MOUNT_") || id.includes("MOUNT")) return "mount";
  if (id.includes("_POTION_") || id.includes("_MEAL_") || id.includes("_SOUP") || id.includes("_SALAD") || id.includes("_SANDWICH") || id.includes("_PIE") || id.includes("_STEW") || id.includes("_OMELETTE")) return "consumable";
  if (id.includes("_FARM") || id.includes("_SEED") || id.includes("_GROWN")) return "farmable";
  if (id.includes("_FURNITURE") || id.includes("_DECORATION")) return "furniture";
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

    const parsed = rawItems
      .filter((item) => item["@uniquename"] && !item["@uniquename"].startsWith("UNIQUE_") && !item["@uniquename"].startsWith("TEST_"))
      .map((item) => {
        const id = item["@uniquename"]!;
        const tierMatch = id.match(/^T(\d)/);
        const tier = tierMatch ? parseInt(tierMatch[1]) : parseInt(item["@tier"] || "0");
        const enchMatch = id.match(/@(\d)$/);
        const enchantment = enchMatch ? parseInt(enchMatch[1]) : parseInt(item["@enchantmentlevel"] || "0");
        const category = categorize(id);
        const subcategory = item["@shopsubcategory1"] || "";

        return { id, name: id, tier, enchantment, category, subcategory };
      })
      .filter(item => item.tier >= 3); // Only T3+ items are tradeable/useful

    let upserted = 0;
    for (let i = 0; i < parsed.length; i += 500) {
      const batch = parsed.slice(i, i + 500);
      const { error } = await supabase.from("items").upsert(batch, { onConflict: "id" });
      if (!error) upserted += batch.length;
      else console.error("Upsert error:", error.message);
    }

    return NextResponse.json({ success: true, upserted, total_raw: rawItems.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
