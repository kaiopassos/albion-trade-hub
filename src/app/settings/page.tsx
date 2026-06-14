"use client";

import { useEffect, useState } from "react";
import { CITIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [playerName, setPlayerName] = useState("");
  const [threshold, setThreshold] = useState("10");
  const [cities, setCities] = useState<string[]>([...CITIES]);
  const [premiumDate, setPremiumDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("*").limit(1).single();
      if (data) {
        setPlayerName(data.player_name);
        setThreshold(String(data.notification_threshold));
        setCities(data.preferred_cities);
        if (data.premium_expiry_date) setPremiumDate(data.premium_expiry_date);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: existing } = await supabase.from("settings").select("id").limit(1).single();
    const payload = {
      player_name: playerName,
      notification_threshold: Number(threshold),
      preferred_cities: cities,
      premium_expiry_date: premiumDate || null,
    };
    if (existing) {
      await supabase.from("settings").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("settings").insert(payload);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCity = (city: string) => {
    setCities((prev) => prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold tracking-tight text-white">Configuracoes</h2>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
        <h3 className="text-sm font-medium text-white">Perfil</h3>
        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Nick no Albion</label>
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Seu nome de jogador"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Vencimento da Premium</label>
          <input type="date" value={premiumDate} onChange={(e) => setPremiumDate(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" />
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
        <h3 className="text-sm font-medium text-white">Scanner de Mercado</h3>
        <div className="space-y-1">
          <label className="text-xs text-neutral-400">Margem minima para alerta (%)</label>
          <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)}
            className="w-32 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-neutral-400">Cidades monitoradas</label>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <button key={city} onClick={() => toggleCity(city)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  cities.includes(city) ? "bg-blue-600 text-white" : "border border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                }`}>
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
        {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
      </button>
    </div>
  );
}
