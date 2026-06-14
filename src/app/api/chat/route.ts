import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-coder:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "google/gemma-4-31b-it:free",
];

const SYSTEM_PROMPT = `Voce e o Assistente do Albion Trade Hub. Responda SEMPRE em portugues brasileiro, de forma direta e pratica.

REGRAS CRITICAS (NUNCA viole):
1. NUNCA invente dados. Use APENAS os dados fornecidos no contexto abaixo.
2. Se nao tiver dados suficientes, diga "nao tenho essa informacao no momento".
3. Quando o jogador perguntar sobre SUA ilha, LEIA os DADOS DA ILHA no contexto e responda baseado neles.
4. O bonus de cidade da ilha e FIXO — NUNCA confunda:
   - Bridgewatch = minerio/pedra (ORE/STONE). Refinar: metalbar, stoneblock.
   - Fort Sterling = madeira (WOOD). Refinar: planks.
   - Lymhurst = couro (HIDE/LEATHER). Refinar: leather. Craft: leather armor, bags.
   - Martlock = fibra/tecido (FIBER/CLOTH). Refinar: cloth. Craft: cloth armor, capas.
   - Thetford = sem bonus, proximo de black zones.
   - Caerleon = hub central, Black Market.
5. Se a ilha do jogador esta em Lymhurst, recomende COURO e LEATHER. NUNCA recomende minerio/aco pra Lymhurst.
6. Para farming (plantacoes e animais), a cidade NAO importa — o retorno e o mesmo em qualquer cidade.
7. Estacoes de craft na ilha devem seguir o bonus da cidade.

O QUE PLANTAR NA ILHA (retorno por ciclo de 22h):
- Cenoura T2: custo ~100, retorno ~1.5K
- Feijao T3: custo ~500, retorno ~3K
- Trigo T4: custo ~1.5K, retorno ~6K
- Nabo T5: custo ~4K, retorno ~12K
- Repolho T6: custo ~10K, retorno ~24K
- Batata T7: custo ~25K, retorno ~48K
- Milho T8: custo ~60K, retorno ~96K

ANIMAIS (retorno por ciclo de 44h):
- Galinha T3: custo ~1K, retorno ~4K
- Cabra T4: custo ~3K, retorno ~8K
- Ganso T5: custo ~8K, retorno ~16K
- Ovelha T6: custo ~20K, retorno ~32K
- Porco T7: custo ~50K, retorno ~64K
- Vaca T8: custo ~120K, retorno ~128K

DICA: Misture plantacoes de tier alto (T5-T7) com 1-2 animais T4-T5 para melhor ROI.

TAXAS DE MERCADO:
- Sem premium: 6.5% (4% imposto + 2.5% setup)
- Com premium: 4.5% (3% imposto + 1.5% setup)

Formato de silver: 1K, 10K, 100K, 1M, etc.
Use nomes de itens do jogo: T4_BAG, T6_METALBAR, etc.`
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Fetch player context
    const [
      { data: topOpps },
      { data: settings },
      { data: islandConfig },
      { data: watchlist },
      { data: transactions },
    ] = await Promise.all([
      supabase.from("opportunities").select("buy_item_id, buy_city, sell_city, margin_net, margin_pct").eq("status", "active").order("margin_net", { ascending: false }).limit(10),
      supabase.from("settings").select("*").limit(1).single(),
      supabase.from("island_config").select("*").limit(1).single(),
      supabase.from("watchlist").select("item_id").limit(10),
      supabase.from("transactions").select("type, total, created_at").order("created_at", { ascending: false }).limit(20),
    ]);

    // Build context
    let context = "";

    // Player info
    const playerName = settings?.player_name || "AlguemMeAjudaPF";
    context += `\n\nDADOS DO JOGADOR:`;
    context += `\n- Nick: ${playerName}`;
    if (settings?.preferred_cities) context += `\n- Cidades preferidas: ${settings.preferred_cities.join(", ")}`;
    if (settings?.premium_expiry_date) context += `\n- Premium expira em: ${settings.premium_expiry_date}`;

    // Island data
    if (islandConfig) {
      context += `\n\nDADOS DA ILHA DO JOGADOR:`;
      context += `\n- Tier da ilha: ${islandConfig.island_tier}`;
      if (islandConfig.plots && Array.isArray(islandConfig.plots)) {
        const plots = islandConfig.plots as { id: number; type: string }[];
        const activePlots = plots.filter(p => p.type !== "empty");
        context += `\n- Plots totais: ${plots.length}`;
        context += `\n- Plots ativos: ${activePlots.length}`;
        if (activePlots.length > 0) {
          context += `\n- Configuracao dos plots: ${activePlots.map(p => `Plot ${p.id}: ${p.type}`).join(", ")}`;
        }
        const emptyPlots = plots.filter(p => p.type === "empty").length;
        if (emptyPlots > 0) context += `\n- Plots vazios: ${emptyPlots}`;
      }
    }

    // Watchlist
    if (watchlist && watchlist.length > 0) {
      context += `\n\nWATCHLIST DO JOGADOR: ${watchlist.map(w => w.item_id).join(", ")}`;
    }

    // Financial summary
    if (transactions && transactions.length > 0) {
      const totalBuy = transactions.filter(t => t.type === "buy").reduce((s, t) => s + Number(t.total), 0);
      const totalSell = transactions.filter(t => t.type === "sell").reduce((s, t) => s + Number(t.total), 0);
      const profit = totalSell - totalBuy;
      context += `\n\nRESUMO FINANCEIRO RECENTE:`;
      context += `\n- Total compras: ${totalBuy} silver`;
      context += `\n- Total vendas: ${totalSell} silver`;
      context += `\n- Lucro: ${profit} silver`;
    }

    // Market opportunities
    if (topOpps && topOpps.length > 0) {
      context += `\n\nTOP 10 OPORTUNIDADES DE FLIP ATIVAS:`;
      for (const o of topOpps) {
        context += `\n- ${o.buy_item_id}: ${o.buy_city} -> ${o.sell_city} = +${o.margin_net} silver (${o.margin_pct}%)`;
      }
    }

    const fullPrompt = SYSTEM_PROMPT.replace("AlguemMeAjudaPF", playerName) + context;

    // Try models in order
    for (const model of MODELS) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: fullPrompt },
              ...messages,
            ],
            max_tokens: 1500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({ error: "Todos os modelos estao indisponiveis no momento. Tente novamente em alguns minutos." }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
