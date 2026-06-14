import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const SYSTEM_PROMPT = `Voce e o Assistente do Albion Trade Hub, um conselheiro especializado em Albion Online.
Voce ajuda jogadores com:
- Estrategias de mercado (city flip, time flip, craft flip)
- Gestao de ilha (o que plantar, melhores cidades, ROI)
- Builds e equipamentos
- Rotas de transporte e riscos
- Economia do jogo em geral

Regras:
- Responda em portugues brasileiro
- Seja direto e pratico
- Use dados de mercado quando disponivel
- Nao invente precos — use os dados reais fornecidos ou diga que nao tem o dado
- Quando falar de silver, use formatacao: 1K, 10K, 1M, etc
- Seja especifico com nomes de itens usando o formato do jogo (ex: T4_BAG, T6_METALBAR)

Dados de contexto do jogador:
- Nick: AlguemMeAjudaPF
- Nivel: Jogador intermediario
- Objetivo: Maximizar lucro para manter premium e acumular silver
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch some market context
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: topOpps } = await supabase
      .from("opportunities")
      .select("buy_item_id, buy_city, sell_city, margin_net, margin_pct")
      .eq("status", "active")
      .order("margin_net", { ascending: false })
      .limit(5);

    const { data: settings } = await supabase
      .from("settings")
      .select("player_name")
      .limit(1)
      .single();

    let marketContext = "";
    if (topOpps && topOpps.length > 0) {
      marketContext = "\n\nTop 5 oportunidades de flip ativas agora:\n";
      for (const o of topOpps) {
        marketContext += `- ${o.buy_item_id}: ${o.buy_city} -> ${o.sell_city} = +${o.margin_net} silver (${o.margin_pct}%)\n`;
      }
    }

    const playerName = settings?.player_name || "AlguemMeAjudaPF";
    const systemWithContext = SYSTEM_PROMPT.replace("AlguemMeAjudaPF", playerName) + marketContext;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-maverick:free",
        messages: [
          { role: "system", content: systemWithContext },
          ...messages,
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, nao consegui processar sua pergunta.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
