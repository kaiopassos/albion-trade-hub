const ITEM_NAMES_PT: Record<string, string> = {
  "T4_BAG": "Bolsa do Adepto",
  "T5_BAG": "Bolsa do Perito",
  "T6_BAG": "Bolsa do Mestre",
  "T7_BAG": "Bolsa do Grao-Mestre",
  "T8_BAG": "Bolsa do Anciao",
  "T4_METALBAR": "Barra de Aco",
  "T5_METALBAR": "Barra de Aco Titanio",
  "T6_METALBAR": "Barra de Aco Runita",
  "T7_METALBAR": "Barra de Aco Meteorico",
  "T8_METALBAR": "Barra de Aco Adamantio",
  "T4_LEATHER": "Couro Trabalhado",
  "T5_LEATHER": "Couro Curado",
  "T6_LEATHER": "Couro Endurecido",
  "T7_LEATHER": "Couro Reforcado",
  "T8_LEATHER": "Couro Fortificado",
  "T4_CLOTH": "Tecido de Linho",
  "T5_CLOTH": "Tecido de Seda",
  "T6_CLOTH": "Tecido de Fenix",
  "T7_CLOTH": "Tecido de Magistrado",
  "T8_CLOTH": "Tecido Real",
  "T4_PLANKS": "Tabuas de Pinho",
  "T5_PLANKS": "Tabuas de Laricio",
  "T6_PLANKS": "Tabuas de Teixo",
  "T4_ORE": "Minerio de Titanio",
  "T5_ORE": "Minerio de Runita",
  "T6_ORE": "Minerio de Meteorito",
  "T4_HIDE": "Couro Grosso",
  "T5_HIDE": "Couro Robusto",
  "T4_FIBER": "Algodao",
  "T5_FIBER": "Linho",
  "T4_WOOD": "Tora de Pinho",
  "T5_WOOD": "Tora de Cedro",
  "T4_ROCK": "Arenito",
  "T5_ROCK": "Travertino",
  "T3_MOUNT_HORSE": "Cavalo do Jornaleiro",
  "T4_MOUNT_HORSE": "Cavalo do Adepto",
  "T5_MOUNT_HORSE": "Cavalo do Perito",
  "T5_MOUNT_ARMOREDHORSE": "Cavalo Blindado do Perito",
  "T4_POTION_HEAL": "Pocao de Cura do Adepto",
  "T5_POTION_HEAL": "Pocao de Cura do Perito",
  "T4_MEAL_STEW": "Salada de Feijao do Adepto",
  "T5_MEAL_STEW": "Salada de Feijao do Perito",
  "T4_MAIN_SWORD": "Espada Larga do Adepto",
  "T5_MAIN_SWORD": "Espada Larga do Perito",
  "T6_MAIN_SWORD": "Espada Larga do Mestre",
};

export function getItemName(itemId: string): string {
  return ITEM_NAMES_PT[itemId] || itemId;
}

export function getTierColor(itemId: string): string {
  const tier = parseInt(itemId.match(/^T(\d)/)?.[1] || "0");
  switch (tier) {
    case 1: return "text-gray-400";
    case 2: return "text-green-400";
    case 3: return "text-blue-400";
    case 4: return "text-purple-400";
    case 5: return "text-yellow-400";
    case 6: return "text-orange-400";
    case 7: return "text-red-400";
    case 8: return "text-red-500";
    default: return "text-gray-400";
  }
}

export function getTierBadgeColor(itemId: string): string {
  const tier = parseInt(itemId.match(/^T(\d)/)?.[1] || "0");
  switch (tier) {
    case 1: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    case 2: return "bg-green-500/20 text-green-400 border-green-500/30";
    case 3: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case 4: return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case 5: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case 6: return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case 7: return "bg-red-500/20 text-red-400 border-red-500/30";
    case 8: return "bg-red-600/20 text-red-500 border-red-600/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}
