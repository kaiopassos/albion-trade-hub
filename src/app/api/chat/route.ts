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

const SYSTEM_PROMPT = `Voce e o Assistente do Albion Trade Hub, um conselheiro especializado em Albion Online.

Voce ajuda jogadores com:
- Estrategias de mercado (city flip, time flip, craft flip)
- Gestao de ilha (o que plantar, melhores cidades, ROI, bonus por cidade)
- Builds e equipamentos meta
- Rotas de transporte e riscos PvP
- Economia do jogo em geral
- Calculo de lucro e taxas (6.5% sem premium, 4.5% com premium)

BONUS POR CIDADE PARA ILHA:
- Bridgewatch: +15% retorno refino de minerio/pedra. Melhor para plate armor e ferramentas.
- Fort Sterling: +15% retorno refino de madeira. Melhor para arcos, staffs e mobilia.
- Lymhurst: +15% retorno refino de couro. Melhor para leather armor e bags.
- Martlock: +15% retorno refino de fibra/tecido. Melhor para cloth armor e capas.
- Thetford: Sem bonus especifico, mas perto de black zones.
- Caerleon: Hub central, acesso ao Black Market.

Regras:
- Responda em portugues brasileiro
- Seja direto e pratico com respostas curtas
- Use dados reais fornecidos no contexto — nao invente precos
- Quando falar de silver, use formatacao: 1K, 10K, 1M, etc
- Use nomes de itens no formato do jogo (ex: T4_BAG, T6_METALBAR)
- Quando o jogador perguntar sobre SUA ilha, use os dados da ilha dele fornecidos no contexto
- De recomendacoes especificas baseadas nos dados reais do jogador
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
