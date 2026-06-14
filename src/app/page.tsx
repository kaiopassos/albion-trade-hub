import { OpportunityList } from "@/components/opportunities/opportunity-list";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Oportunidades</h2>
        <p className="text-neutral-400 text-sm">
          Flips ativos ranqueados por lucro liquido. Atualizado em tempo real.
        </p>
      </div>
      <OpportunityList />
    </div>
  );
}
