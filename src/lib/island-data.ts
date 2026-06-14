export interface CityBonus {
  city: string;
  resourceBonus: string;
  craftBonus: string;
  description: string;
  bestFor: string[];
}

export const CITY_BONUSES: CityBonus[] = [
  { city: "Bridgewatch", resourceBonus: "Pedra & Minerio", craftBonus: "+15% retorno refino ore/stone", description: "Melhor cidade para refinar minerio e pedra. Ideal para quem foca em plate armor e ferramentas.", bestFor: ["Refino de Ore", "Refino de Stone", "Craft de Plate Armor"] },
  { city: "Fort Sterling", resourceBonus: "Madeira", craftBonus: "+15% retorno refino wood", description: "Melhor cidade para refinar madeira. Ideal para quem foca em arcos, staffs e mobilia.", bestFor: ["Refino de Wood", "Craft de Bows", "Craft de Staffs"] },
  { city: "Lymhurst", resourceBonus: "Couro", craftBonus: "+15% retorno refino leather", description: "Melhor cidade para refinar couro. Ideal para quem foca em leather armor e bags.", bestFor: ["Refino de Leather", "Craft de Leather Armor", "Craft de Bags"] },
  { city: "Martlock", resourceBonus: "Fibra & Tecido", craftBonus: "+15% retorno refino fiber/cloth", description: "Melhor cidade para refinar fibra e tecido. Ideal para quem foca em cloth armor e capas.", bestFor: ["Refino de Fiber", "Craft de Cloth Armor", "Craft de Capes"] },
  { city: "Thetford", resourceBonus: "Nenhum especifico", craftBonus: "Proximo a black zones", description: "Sem bonus de refino, mas acesso rapido a black zones e recursos T6+.", bestFor: ["Acesso a Black Zones", "PvP", "Recursos de alto tier"] },
  { city: "Caerleon", resourceBonus: "Hub Central", craftBonus: "Acesso ao Black Market", description: "Hub central do jogo. Black Market compra itens a precos premium. Maior volume de mercado.", bestFor: ["Black Market", "Trading de alto volume", "Todas as categorias"] },
];

export interface FarmCrop {
  id: string;
  name: string;
  tier: number;
  seedCost: number;
  yieldAmount: number;
  growthTime: string;
  estimatedReturn: number;
  focusSaving: number;
  notes: string;
}

export const FARM_CROPS: FarmCrop[] = [
  { id: "carrot", name: "Cenoura", tier: 2, seedCost: 100, yieldAmount: 9, growthTime: "22h", estimatedReturn: 1500, focusSaving: 200, notes: "Basico, bom para iniciantes" },
  { id: "bean", name: "Feijao", tier: 3, seedCost: 500, yieldAmount: 9, growthTime: "22h", estimatedReturn: 3000, focusSaving: 500, notes: "Usado em comidas T3" },
  { id: "wheat", name: "Trigo", tier: 4, seedCost: 1500, yieldAmount: 9, growthTime: "22h", estimatedReturn: 6000, focusSaving: 1000, notes: "Alta demanda para comidas T4" },
  { id: "turnip", name: "Nabo", tier: 5, seedCost: 4000, yieldAmount: 9, growthTime: "22h", estimatedReturn: 12000, focusSaving: 2000, notes: "Excelente ROI para tier medio" },
  { id: "cabbage", name: "Repolho", tier: 6, seedCost: 10000, yieldAmount: 9, growthTime: "22h", estimatedReturn: 24000, focusSaving: 4000, notes: "Alto investimento, alto retorno" },
  { id: "potato", name: "Batata", tier: 7, seedCost: 25000, yieldAmount: 9, growthTime: "22h", estimatedReturn: 48000, focusSaving: 8000, notes: "Requer ilha T7+" },
  { id: "corn", name: "Milho", tier: 8, seedCost: 60000, yieldAmount: 9, growthTime: "22h", estimatedReturn: 96000, focusSaving: 15000, notes: "Maximo retorno farming" },
];

export const FARM_ANIMALS: FarmCrop[] = [
  { id: "chicken", name: "Galinha", tier: 3, seedCost: 1000, yieldAmount: 1, growthTime: "44h", estimatedReturn: 4000, focusSaving: 600, notes: "Produz ovos para comida" },
  { id: "goat", name: "Cabra", tier: 4, seedCost: 3000, yieldAmount: 1, growthTime: "44h", estimatedReturn: 8000, focusSaving: 1200, notes: "Leite para comidas T4" },
  { id: "goose", name: "Ganso", tier: 5, seedCost: 8000, yieldAmount: 1, growthTime: "44h", estimatedReturn: 16000, focusSaving: 2500, notes: "Ovos para comidas T5" },
  { id: "sheep", name: "Ovelha", tier: 6, seedCost: 20000, yieldAmount: 1, growthTime: "44h", estimatedReturn: 32000, focusSaving: 5000, notes: "La para cloth refinamento" },
  { id: "pig", name: "Porco", tier: 7, seedCost: 50000, yieldAmount: 1, growthTime: "44h", estimatedReturn: 64000, focusSaving: 10000, notes: "Alto valor, carne premium" },
  { id: "cow", name: "Vaca", tier: 8, seedCost: 120000, yieldAmount: 1, growthTime: "44h", estimatedReturn: 128000, focusSaving: 20000, notes: "Maximo retorno animal" },
];

export interface BuildingType {
  id: string;
  name: string;
  description: string;
  tier: number;
  buildCost: number;
  dailyFoodCost: number;
  bestCity: string;
}

export const BUILDINGS: BuildingType[] = [
  { id: "warrior_forge", name: "Forja de Guerreiro", description: "Craft de plate armor e armas corpo-a-corpo", tier: 4, buildCost: 50000, dailyFoodCost: 30, bestCity: "Bridgewatch" },
  { id: "hunter_lodge", name: "Cabana de Cacador", description: "Craft de leather armor, arcos e nature staffs", tier: 4, buildCost: 50000, dailyFoodCost: 30, bestCity: "Lymhurst" },
  { id: "mage_tower", name: "Torre de Mago", description: "Craft de cloth armor e staffs magicos", tier: 4, buildCost: 50000, dailyFoodCost: 30, bestCity: "Martlock" },
  { id: "toolmaker", name: "Oficina de Ferramentas", description: "Craft de ferramentas, mobilia e acessorios", tier: 4, buildCost: 50000, dailyFoodCost: 30, bestCity: "Fort Sterling" },
  { id: "butcher", name: "Acougue", description: "Processar carne e preparar alimentos", tier: 4, buildCost: 30000, dailyFoodCost: 20, bestCity: "Qualquer" },
  { id: "mill", name: "Moinho", description: "Processar graos e farinha", tier: 4, buildCost: 30000, dailyFoodCost: 20, bestCity: "Qualquer" },
];

export function getRecommendation(silverBudget: number, islandTier: number, city: string): string[] {
  const tips: string[] = [];

  if (islandTier <= 3) {
    tips.push("Foque em upar sua ilha para T4-T5 primeiro. O custo compensa pelo numero extra de plots.");
  }

  if (silverBudget < 50000) {
    tips.push("Com orcamento limitado, plante Cenoura/Feijao (T2-T3). Baixo custo, retorno rapido.");
    tips.push("Evite animais por enquanto — sementes sao caras para seu orcamento.");
  } else if (silverBudget < 200000) {
    tips.push("Misture plantacoes T4-T5 (Trigo/Nabo) com 1-2 criacoes T3-T4.");
    tips.push("Considere uma estacao de craft se tiver Focus disponivel.");
  } else {
    tips.push("Maximize com T6-T7 farming + animais T5-T6 para melhor ROI.");
    tips.push("Monte estacoes de craft na cidade com bonus relevante.");
  }

  const cityBonus = CITY_BONUSES.find(c => c.city === city);
  if (cityBonus && city !== "Thetford") {
    tips.push(`Sua ilha em ${city} tem bonus de ${cityBonus.resourceBonus}. Aproveite montando estacoes de ${cityBonus.bestFor[0]}.`);
  }

  return tips;
}
