import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { loadStore, saveStore } from '../utils/storage'
import { useAppSelector } from '../store/hooks'
import type { Player, Team } from '../types'

// --- HELPERS ---
function fireConfetti() {
    confetti({ particleCount: 200, spread: 90, gravity: 0.4, origin: { y: 0.6 } })
    confetti({ particleCount: 80, spread: 50, startVelocity: 40, decay: 0.9, scalar: 1.2 })
    confetti({ particleCount: 40, spread: 360, scalar: 0.8 })
}

export function getLocalImageUrl(photo: string) {
    if (!photo) return '/images/placeholder-player.jpg';
    const match = photo.match(/id=([a-zA-Z0-9_-]+)/) || photo.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!match) return '/images/placeholder-player.jpg';
    const fileId = match[1];
    return `/images/${fileId}.jpg`;
}

// --- COMPONENTS ---
function PlayerCard({ player, bid, onBid, incOptions, increase, setIncrease, teams, selectedTeam, setSelectedTeam, onSold, dark }: {
    player: Player,
    bid: number,
    onBid: (delta: number) => void,
    incOptions: number[],
    increase: number,
    setIncrease: (n: number) => void,
    teams: Team[],
    selectedTeam: string | null,
    setSelectedTeam: (id: string) => void,
    onSold: () => void,
    dark: boolean
}) {
    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const bg = dark ? 'bg-gray-800' : 'bg-white'
    const text = dark ? 'text-white' : 'text-gray-900'
    const subText = dark ? 'text-gray-400' : 'text-gray-500'
    const btnBg = dark ? '!bg-blue-400 hover:bg-gray-600' : '!bg-orange-400 hover:bg-gray-300'

    return (
        <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3, y: -40 }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className={`${bg} rounded-xl flex items-center gap-4 shadow-2xl border ${dark ? 'border-gray-700' : 'border-gray-300'} w-full overflow-hidden h-100`}
            style={{ aspectRatio: '3/4' }}
        >
            <div className="relative w-full h-100 mx-auto">
                <img
                    src={getLocalImageUrl(player.photo ? player.photo : '')}
                    alt={player.name}
                    className="w-full h-full object-contain p-2 rounded-full transition-all duration-300"
                />
            </div>

            <div className="text-center space-y-1">
                <div className={`text-xl font-bold ${text}`}>{player.name}</div>
                <div className={`text-sm ${subText}`}>{player.role}</div>
                <div className={`text-sm ${subText}`}>{player.category}</div>
            </div>

            <div className="text-center">
                <div className={`text-sm ${subText}`}>Base Price</div>
                <div className="text-3xl font-extrabold">{`₹ ${player.basePrice ?? 0}`}</div>
            </div>

            <div className="w-full flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-center gap-4">
                    <button className={`${btnBg} text-black px-4 py-2 rounded-lg font-bold`} onClick={() => onBid(-increase)}>-</button>
                    <div className={`text-xl font-bold ${text}`}>{`₹ ${bid}`}</div>
                    <button className={`${btnBg} text-black px-4 py-2 rounded-lg font-bold`} onClick={() => onBid(increase)}>+</button>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <select value={increase} onChange={e => setIncrease(Number(e.target.value))}
                        className={`${dark ? '!bg-gray-700 !text-white' : '!bg-gray-200 !text-gray-900'} px-3 py-2 rounded`}
                    >
                        {incOptions.map(i => <option key={i} value={i}>+{i}</option>)}
                    </select>

                    <select value={selectedTeam ?? ''} onChange={e => setSelectedTeam(e.target.value)}
                        className={`${dark ? '!bg-gray-700 !text-white' : '!bg-gray-200 !text-gray-900'} px-3 py-2 rounded`}
                    >
                        <option value="">Select team</option>
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>

                    <button onClick={onSold} className={`${btnBg} text-black px-4 py-2 rounded-lg font-extrabold`}>SOLD</button>
                </div>
            </div>
        </motion.div>
    )
}


export function TeamListHorizontal({ players, teams, dark }: { players: Player[], teams: Team[], dark: boolean }) {

    return (
        <div className={`${dark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-4 rounded-xl shadow-lg mb-6 overflow-hidden relative`}>
            <div className="whitespace-nowrap animate-marquee">
                {teams.map((t, idx) => {
                    const committed = players
                        .filter(p => p.soldTo === t.id)
                        .reduce((sum, p) => sum + (p.soldPrice || 0), 0);
                    const remaining = (t.budget ?? 0) - committed;
                    return (
                        <motion.div
                            key={t.id}
                            className={`inline-flex items-center gap-3 mx-4 px-4 py-2 rounded-xl shadow-md ${dark ? 'bg-gray-800' : 'bg-white'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, type: 'spring', stiffness: 120, damping: 18 }}
                        >
                            <img
                                src={t.logo}
                                alt={t.name}
                                className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
                            />
                            <div className="flex flex-col">
                                <div className={`${dark ? 'text-white' : 'text-gray-900'} font-bold text-lg`}>{t.name}</div>
                                <div className={`${dark ? 'text-gray-300' : 'text-gray-500'} font-bold text-lg`}>
                                    Players: {t.players.length}
                                </div>
                                {t.budget && (
                                    <div className={`${dark ? 'text-gray-200' : 'text-gray-600'} font-bold text-lg`}>
                                        Remaining Balance: ₹ {remaining}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    )
                })}


            </div>

            <style>{`
                .animate-marquee {
                    display: inline-block;
                    padding-left: 100%;
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    )
}

function SoldPopup({ justSold, onUndo, dark }: { justSold: { player?: Player; teamName?: string } | null; onUndo: () => void; dark: boolean }) {
    if (!justSold) return null
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 60 }}
            animate={{ opacity: 1, scale: 1.15, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 40 }}
            transition={{ type: 'spring', stiffness: 180, damping: 12 }}
            className={`${dark ? 'bg-green-500 text-white border-green-700' : 'bg-green-400 text-black border-black'} fixed right-8 bottom-8 px-6 py-4 rounded-xl shadow-2xl font-bold text-lg border-2 flex items-center gap-4`}
        >
            <div>
                <div>🎉 SOLD: {justSold.player?.name}</div>
                <div className="text-sm">{justSold.teamName}</div>
            </div>
            <button
                onClick={onUndo}
                className={`${dark ? 'bg-white/20 text-white hover:bg-white/40' : 'bg-white/30 text-black hover:bg-white/50'} px-3 py-1 rounded text-sm font-bold transition-colors`}
            >
                Undo
            </button>
        </motion.div>
    )
}

function ErrorPopup({ errorMsg, dark }: { errorMsg: string | null; dark: boolean }) {
    if (!errorMsg) return null
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`${dark ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} fixed right-8 bottom-8 px-6 py-3 rounded-xl shadow-xl font-bold`}
        >
            {errorMsg}
        </motion.div>
    )
}

// --- MAIN AUCTION COMPONENT ---
export default function Auction() {
    const mode = useAppSelector(state => state.theme.mode)
    const dark = mode === 'dark'

    // --- STATE ---
    const [players, setPlayers] = useState<Player[]>([])
    const [teams, setTeams] = useState<Team[]>([])
    const [category, setCategory] = useState('')
    const [running, setRunning] = useState(false)
    const [bids, setBids] = useState<Record<string, number>>({})
    const [increase, setIncrease] = useState(10000)
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
    const [justSold, setJustSold] = useState<{ player?: Player; teamName?: string } | null>(null)
    const [lastSold, setLastSold] = useState<{ player: Player; teamId: string; price: number } | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0);
    const incOptions = [10000, 5000]

    // --- LOAD/STORE ---
    useEffect(() => {
        const st = loadStore()
        setPlayers(st.players || [])
        setTeams(st.teams || [])
    }, [])

    useEffect(() => {
        setCurrentIndex(0);
    }, [category]);


    useEffect(() => {
        if (!errorMsg) return;
        const timer = setTimeout(() => setErrorMsg(null), 3000);
        return () => clearTimeout(timer)
    }, [errorMsg]);

    useEffect(() => {
        const timeout = setTimeout(() => saveStore({ players, teams }), 300)
        return () => clearTimeout(timeout)
    }, [players, teams])

    // --- CATEGORIES ---
    const categories = useMemo(() => Array.from(new Set(players.map(p => p.category || '').filter(Boolean))), [players])
    useEffect(() => { if (!category && categories.length) setCategory(categories[0]) }, [categories, category])
    const queue = useMemo(() => {
        return players
            .filter(p => (p.category || '') === category && !p.sold)
            .map(p => p.id);
    }, [players, category]);

    // --- BID LOGIC ---
    const changeBid = (id: string, delta: number) => {
        setBids(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] ?? players.find(p => p.id === id)?.basePrice ?? 0) + delta),
        }))
    }

    // --- UNDO LOGIC ---
    const undoSold = useCallback(() => {
        if (!lastSold) return;
        const { player, teamId } = lastSold
        setPlayers(prev => prev.map(p => p.id === player.id ? { ...p, sold: false, soldTo: undefined, soldPrice: undefined } : p))
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, players: t.players.filter(id => id !== player.id) } : t))
        setBids(prev => { const n = { ...prev }; delete n[player.id]; return n })
        setLastSold(null); setJustSold(null)
    }, [lastSold])

    // --- SOLD LOGIC ---
    const doSold = (p: Player) => {
        if (!selectedTeam) return setErrorMsg('Please select a team before selling the player.')
        const price = bids[p.id] ?? p.basePrice ?? 0
        const teamObj = teams.find(t => t.id === selectedTeam)
        const committed = players.filter(pp => pp.soldTo === selectedTeam).reduce((s, pp) => s + (pp.soldPrice || 0), 0)
        const remaining = (teamObj?.budget ?? 0) - committed
        if (price >= remaining) return setErrorMsg(`Insufficient funds: required ₹${price}, remaining ₹${remaining}`)
        setPlayers(list => list.map(x => x.id === p.id ? { ...x, sold: true, soldTo: selectedTeam, soldPrice: price } : x))
        setTeams(t => t.map(team => team.id === selectedTeam ? { ...team, players: [...team.players, p.id] } : team))
        const tname = teams.find(t => t.id === selectedTeam)?.name
        setLastSold({ player: p, teamId: selectedTeam, price })
        setJustSold({ player: p, teamName: tname })
        setSelectedTeam(null)
        fireConfetti()
        setTimeout(() => setJustSold(null), 5000)
    }

    return (
        <div className={`${dark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} pb-16 min-h-screen p-6`}>
            {/* HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>Auction</h1>
                <div className="flex gap-3 items-center">
                    <div className={`${dark ? '!bg-gray-700 !text-gray-300' : '!bg-gray-200 !text-gray-800'} text-lg`}>
                        Remaining Players for <span className="font-bold">{category}</span>: <span className="font-bold">{queue.length}</span>
                    </div>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                        className={`${dark ? '!bg-gray-700 !text-white' : '!bg-gray-200 !text-gray-900'} px-3 py-2 rounded`}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => setRunning(r => !r)}
                        className={`${dark ? '!bg-blue-400 text-black' : '!bg-orange-400 text-black'} px-4 py-2 rounded font-semibold`}
                    >
                        {running ? 'Stop' : 'Start'} Auction
                    </button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-8">
                <div className="flex flex-col gap-4 overflow-hidden">
                    <TeamListHorizontal teams={teams} dark={dark} players={players} />
                    <div className="flex justify-center gap-4 mb-4">
                        <button
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                            className={`${dark ? '!bg-gray-700 !text-white' : '!bg-gray-200 !text-gray-900'} px-4 py-2 bg-gray-300 rounded disabled:opacity-40`}
                        >
                            Previous
                        </button>

                        <button
                            disabled={currentIndex >= queue.length - 1}
                            onClick={() => setCurrentIndex(i => Math.min(queue.length - 1, i + 1))}
                            className={`${dark ? '!bg-gray-700 !text-white' : '!bg-gray-200 !text-gray-900'} px-4 py-2 bg-gray-300 rounded disabled:opacity-40`}
                        >
                            Next
                        </button>
                    </div>

                    <AnimatePresence>
                        {queue.length === 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-center text-xl`}>No players remaining</motion.div>}
                        {queue.length > 0 && (() => {
                            const id = queue[currentIndex];
                            const p = players.find(x => x.id === id);
                            if (!p) return null;
                            return (
                                <PlayerCard
                                    key={p.id}
                                    player={p}
                                    bid={bids[p.id] ?? p.basePrice ?? 0}
                                    onBid={delta => changeBid(p.id, delta)}
                                    incOptions={incOptions}
                                    increase={increase}
                                    setIncrease={setIncrease}
                                    teams={teams}
                                    selectedTeam={selectedTeam}
                                    setSelectedTeam={setSelectedTeam}
                                    onSold={() => {
                                        doSold(p);
                                        setCurrentIndex(0); // auto jump back after sold
                                    }}
                                    dark={dark}
                                />
                            );
                        })()}
                    </AnimatePresence>
                </div>


            </div>

            <AnimatePresence>
                {justSold && <SoldPopup justSold={justSold} onUndo={undoSold} dark={dark} />}
                {errorMsg && <ErrorPopup errorMsg={errorMsg} dark={dark} />}
            </AnimatePresence>
        </div>
    )
}
