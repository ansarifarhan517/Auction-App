import { useMemo, useState } from 'react'
import { loadStore } from '../utils/storage'
import { useAppSelector } from '../store/hooks'
import type { Team, Player } from '../types'
import { getLocalImageUrl } from './Auction'

export default function Summary() {
  const st = loadStore()
  const mode = useAppSelector(state => state.theme.mode)
  const dark = mode === 'dark'

  const [teamId, setTeamId] = useState<string | null>(st.teams?.[0]?.id ?? null)

  const team = useMemo(() => st.teams.find(t => t.id === teamId) ?? null, [teamId, st])
  const players: Player[] = st.players.filter(p => team?.players.includes(p.id))

  const balance = team ? team.budget - players.reduce((s, p) => s + (p.soldPrice || 0), 0) : 0

const exportCSV = () => {
  if (!st.teams || !st.players) return;

  // Create dictionary team → sold players
  const teamPlayers: Record<string, Player[]> = {};

  st.teams.forEach(team => {
    teamPlayers[team.name] = st.players.filter(
      p => p.sold && p.soldTo === team.id
    );
  });

  // CSV rows will be built row-wise
  const rows: string[][] = [];

  // HEADER row → team names
  const header = st.teams.map(t => t.name);
  rows.push(header);

  // Find the maximum number of players in any team
  const maxPlayers = Math.max(
    ...Object.values(teamPlayers).map(p => p.length)
  );

  // Build rows player by player
  for (let i = 0; i < maxPlayers; i++) {
    const row: string[] = [];
    st.teams.forEach(team => {
      const p = teamPlayers[team.name][i];
      row.push(p ? p.name : ""); // Empty if no player for this row
    });
    rows.push(row);
  }

  // Convert to CSV string
  const csv = rows.map(r =>
    r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `teams_side_by_side.csv`;
  a.click();
  URL.revokeObjectURL(url);
};


  return (
    <div className={`${dark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-8 min-h-screen`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{team?.name ?? 'Summary'}</h1>
        <div className="flex items-center gap-2">
          <select
            value={teamId ?? ''}
            onChange={e => setTeamId(e.target.value)}
            className={`${dark ? '!bg-gray-800 !text-white' : '!bg-gray-200 !text-gray-900'} px-3 py-2 rounded text-sm`}
          >
            {st.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button
            onClick={exportCSV}
            className={`ml-2 px-3 py-2 rounded font-semibold ${dark ? '!bg-blue-400 !text-black !hover:bg-blue-500' : '!bg-orange-400 !text-black !hover:bg-orange-500'}`}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Budget & Players */}
      <div className={`${dark ? 'bg-gray-800' : 'bg-white'} mt-6 p-4 rounded-lg shadow-md`}>
        <div className={`${dark ? 'text-gray-200' : 'text-gray-700'} mb-3`}>
          Budget: ₹ {team?.budget ?? 0} • Remaining: <strong>₹ {balance}</strong>
        </div>
        <div className="space-y-2">
          {players.map(p => (
            <div key={p.id} className={`${dark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center gap-3 p-2 rounded`}>
              <img
                src={getLocalImageUrl(p.photo)}
                alt={p.name}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  const fallback = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80&facepad=2&q=80'
                  if (!img.src.includes('unsplash.com')) img.src = fallback
                }}
                className="w-12 h-12 rounded object-cover bg-gray-600"
              />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className={`${dark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{p.role} • {p.category}</div>
              </div>
              <div className={`${dark ? 'text-gray-200' : 'text-gray-700'} font-semibold`}>
                ₹ {p.soldPrice ?? '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
