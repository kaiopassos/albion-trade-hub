import { NextResponse } from "next/server";

const GAMEINFO_URL = "https://gameinfo.albiononline.com/api/gameinfo";

interface KillEvent {
  Killer: {
    Name: string;
    GuildName: string;
    Equipment: Record<string, { Type: string } | null>;
    AverageItemPower: number;
  };
  TotalVictimKillFame: number;
}

interface BuildEntry {
  weapon: string;
  helmet: string;
  armor: string;
  shoes: string;
  cape: string;
  avgIP: number;
  kills: number;
  totalFame: number;
  players: string[];
}

export async function GET() {
  try {
    // Fetch recent kills from multiple pages
    const allKills: KillEvent[] = [];
    for (let offset = 0; offset < 200; offset += 51) {
      const res = await fetch(`${GAMEINFO_URL}/events?limit=51&offset=${offset}`, {
        next: { revalidate: 300 }, // cache 5 min
      });
      if (!res.ok) continue;
      const kills = await res.json();
      allKills.push(...kills);
    }

    // Aggregate builds by weapon type
    const buildMap = new Map<string, BuildEntry>();

    for (const kill of allKills) {
      const eq = kill.Killer?.Equipment;
      if (!eq) continue;

      const weapon = eq.MainHand?.Type || "";
      const helmet = eq.Head?.Type || "";
      const armor = eq.Armor?.Type || "";
      const shoes = eq.Shoes?.Type || "";
      const cape = eq.Cape?.Type || "";

      if (!weapon) continue;

      // Key by weapon + armor combo (ignore tier for grouping)
      const weaponBase = weapon.replace(/^T\d_/, "").replace(/@\d$/, "");
      const armorBase = armor.replace(/^T\d_/, "").replace(/@\d$/, "");
      const key = `${weaponBase}|${armorBase}`;

      const existing = buildMap.get(key) || {
        weapon, helmet, armor, shoes, cape,
        avgIP: 0, kills: 0, totalFame: 0, players: [],
      };

      existing.kills += 1;
      existing.totalFame += kill.TotalVictimKillFame || 0;
      existing.avgIP = (existing.avgIP * (existing.kills - 1) + (kill.Killer.AverageItemPower || 0)) / existing.kills;
      if (existing.players.length < 3 && kill.Killer.Name && !existing.players.includes(kill.Killer.Name)) {
        existing.players.push(kill.Killer.Name);
      }

      buildMap.set(key, existing);
    }

    // Sort by kills descending, take top 20
    const builds = Array.from(buildMap.values())
      .filter(b => b.kills >= 2)
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 20)
      .map((b, i) => ({
        rank: i + 1,
        weapon: b.weapon,
        helmet: b.helmet,
        armor: b.armor,
        shoes: b.shoes,
        cape: b.cape,
        avgIP: Math.round(b.avgIP),
        kills: b.kills,
        totalFame: b.totalFame,
        players: b.players,
      }));

    return NextResponse.json({ builds, totalEvents: allKills.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message, builds: [] }, { status: 500 });
  }
}
