import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const response = await fetch("https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/items.json");
    if (!response.ok) throw new Error(`Failed to fetch items: ${response.status}`);

    const items = await response.json();
    const parsed = items
      .filter((item: { UniqueName: string }) => item.UniqueName && !item.UniqueName.startsWith("UNIQUE_"))
      .map((item: { UniqueName: string; LocalizedNames?: Record<string, string> }) => {
        const id = item.UniqueName;
        const tierMatch = id.match(/^T(\d)/);
        const tier = tierMatch ? parseInt(tierMatch[1]) : 0;
        const enchMatch = id.match(/@(\d)$/);
        const enchantment = enchMatch ? parseInt(enchMatch[1]) : 0;
        const name = item.LocalizedNames?.["EN-US"] || item.LocalizedNames?.["en-US"] || id;
        let category = "other";
        if (id.includes("_ORE") || id.includes("_HIDE") || id.includes("_FIBER") || id.includes("_WOOD") || id.includes("_ROCK")) category = "resource";
        else if (id.includes("_METALBAR") || id.includes("_LEATHER") || id.includes("_CLOTH") || id.includes("_PLANKS")) category = "material";
        else if (id.includes("_MAIN_") || id.includes("_2H_") || id.includes("_OFF_")) category = "weapon";
        else if (id.includes("_HEAD_") || id.includes("_ARMOR_") || id.includes("_SHOES_")) category = "armor";
        else if (id.includes("_BAG") || id.includes("_CAPE")) category = "accessory";
        else if (id.includes("_MOUNT_")) category = "mount";
        else if (id.includes("_POTION_") || id.includes("_MEAL_")) category = "consumable";
        return { id, name, tier, enchantment, category, subcategory: "" };
      });

    let upserted = 0;
    for (let i = 0; i < parsed.length; i += 500) {
      const batch = parsed.slice(i, i + 500);
      const { error } = await supabase.from("items").upsert(batch, { onConflict: "id" });
      if (!error) upserted += batch.length;
    }

    return new Response(JSON.stringify({ success: true, upserted }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
