import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const articles: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  "city-flip": {
    title: "City Flip",
    sections: [
      { heading: "O que e City Flip?", content: "City flip e comprar um item barato em uma cidade e vender mais caro em outra. Cada cidade do Albion tem mercado independente com precos diferentes." },
      { heading: "Como funciona", content: "1. Use o scanner de oportunidades para encontrar diferencas de preco.\n2. Compre na cidade mais barata via sell orders.\n3. Transporte ate a cidade com preco mais alto (cuidado com zonas PvP!).\n4. Venda no mercado da cidade de destino." },
      { heading: "Calculando o Lucro", content: "Lucro Liquido = Preco Venda - Preco Compra - Taxa (6.5% do preco de venda)\n\nExemplo: Compra a 10.000 em Lymhurst, vende a 15.000 em Caerleon.\nMargem bruta: 5.000 | Taxa: 975 | Lucro: 4.025 (40.25%)" },
      { heading: "Dicas", content: "- Prefira itens com alto volume de transacoes.\n- Rotas com zonas vermelhas/pretas dao mais lucro mas tem risco.\n- Melhores horarios: picos de jogadores online.\n- Considere peso da carga e capacidade do mount." },
    ],
  },
  "time-flip": {
    title: "Time Flip",
    sections: [
      { heading: "O que e Time Flip?", content: "Comprar um item quando o preco esta temporariamente abaixo da media e segurar para revender quando normalizar." },
      { heading: "Como funciona", content: "1. Monitore historicos no Explorador de Precos.\n2. O scanner marca itens 20%+ abaixo da media de 7 dias.\n3. Compre na baixa e aguarde recuperacao.\n4. Venda quando voltar a media ou acima." },
      { heading: "Riscos", content: "- Preco pode NAO voltar (nerf, mudanca de meta).\n- Capital fica preso enquanto espera.\n- Funciona melhor com consumiveis e materiais de demanda constante." },
    ],
  },
  "craft-flip": {
    title: "Craft Flip",
    sections: [
      { heading: "O que e Craft Flip?", content: "Comprar materias-primas, craftar o item e vender com lucro." },
      { heading: "Formula", content: "Lucro = Preco Item Final - Soma Materiais - Taxa Mercado (6.5%) - Taxa Estacao\n\nUse estacoes na ilha para evitar taxa. Focus reduz custo de materiais." },
      { heading: "Dicas", content: "- Focus e limitado — use em crafts de alto valor.\n- Itens com encantamento (@1, @2, @3) tem margem maior.\n- Acompanhe preco dos materiais — flutuam bastante." },
    ],
  },
  rotas: {
    title: "Melhores Rotas",
    sections: [
      { heading: "Rotas Seguras", content: "- Lymhurst <-> Fort Sterling: zona segura, bom para iniciantes.\n- Bridgewatch <-> Martlock: recursos complementares.\n- Thetford <-> Lymhurst: curta distancia, alto volume." },
      { heading: "Rotas de Alto Lucro", content: "- Qualquer cidade -> Caerleon: hub central, precos mais altos.\n- Caerleon -> Black Market: NPCs compram a precos premium." },
      { heading: "Dicas", content: "- Rotas longas = margens maiores.\n- Evite rotas perigosas nos picos PvP.\n- Use mounts rapidos com boa capacidade." },
    ],
  },
  taxas: {
    title: "Taxas e Impostos",
    sections: [
      { heading: "Taxa de Mercado", content: "Sem Premium: 6.5% (4% imposto + 2.5% setup)\nCom Premium: 4.5% (3% imposto + 1.5% setup)\n\nCalculada sobre o preco de VENDA." },
      { heading: "Taxa de Estacao", content: "Estacoes publicas cobram taxa variavel.\nEstacoes na ilha: sem taxa.\nEstacoes de guild: taxa definida pelo leader." },
      { heading: "Premium vale a pena?", content: "Sim, se voce movimenta volume. A diferenca de 2% em cada transacao acumula rapido." },
    ],
  },
  glossario: {
    title: "Glossario",
    sections: [
      { heading: "Termos do Mercado", content: "- Sell Order: ordem de venda no mercado.\n- Buy Order: ordem de compra (voce define o preco).\n- Spread: diferenca entre sell min e buy max.\n- Flip: comprar barato e vender caro.\n- Margin: margem de lucro.\n- Net Margin: margem liquida (apos taxas).\n- Volume: quantidade de transacoes.\n- Tier: nivel do item (T1-T8).\n- Enchantment: encantamento (@1-@4).\n- Focus: recurso diario (premium) que reduz custo.\n- Premium: assinatura (~9M silver).\n- Black Market: mercado especial em Caerleon.\n- AH: Auction House (mercado da cidade)." },
    ],
  },
};

export default async function GuideArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/guide" className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>
      <h2 className="text-2xl font-bold text-white">{article.title}</h2>
      {article.sections.map((section, i) => (
        <div key={i} className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{section.heading}</h3>
          {section.content.split("\n").map((line, j) => (
            <p key={j} className="text-sm text-neutral-400">{line}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
