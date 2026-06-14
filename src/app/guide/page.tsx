import Link from "next/link";
import { ArrowRight } from "lucide-react";

const guides = [
  { slug: "city-flip", title: "City Flip", description: "Compre barato em uma cidade e venda mais caro em outra." },
  { slug: "time-flip", title: "Time Flip", description: "Compre quando o preco esta abaixo da media historica." },
  { slug: "craft-flip", title: "Craft Flip", description: "Compre materias-primas, crafte e venda com lucro." },
  { slug: "rotas", title: "Melhores Rotas", description: "Rotas lucrativas entre cidades considerando risco e volume." },
  { slug: "taxas", title: "Taxas e Impostos", description: "Como funcionam as taxas do mercado e como calcular margem." },
  { slug: "glossario", title: "Glossario", description: "Termos comuns do mercado do Albion Online." },
];

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#e8d5b5]">Guia do Trader</h2>
        <p className="text-[#8b7635] text-sm">Aprenda os fundamentos do mercado do Albion Online.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guide/${guide.slug}`}
            className="rounded-lg border border-[#3a3028] bg-[#241e18] p-6 transition-colors hover:bg-[#2e2620] hover:border-[#c8a84e]/30">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-[#e8d5b5]">{guide.title}</h3>
              <ArrowRight className="h-4 w-4 text-[#8b7635]" />
            </div>
            <p className="text-sm text-[#a89070]">{guide.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
