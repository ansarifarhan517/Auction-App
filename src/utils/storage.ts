import { type Player, type Team } from '../types'

const KEY = 'auction_app_v1'

type Store = {
    teams: Team[]
    players: Player[]
    categories: string[]
}

const initial: Store = { teams: [], players: [], categories: [] }

export function loadStore(): Store {
    try {
        const raw = localStorage.getItem(KEY)
        if (!raw) return initial
        return JSON.parse(raw) as Store
    } catch (e) {
        console.error('loadStore', e)
        return initial
    }
}

export function saveStore(s: Partial<Store>) {
    const cur = loadStore()
    const merged = { ...cur, ...s }
    localStorage.setItem(KEY, JSON.stringify(merged))
}

export function resetStore() {
    localStorage.removeItem(KEY)
}
