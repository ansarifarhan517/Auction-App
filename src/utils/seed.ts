import Papa from 'papaparse'
import { v4 as uuid } from 'uuid'
import { loadStore, saveStore } from './storage'
import type { Player, Team } from '../types'

async function fetchText(path: string) {
  try {
    const res = await fetch(path)
    if (!res.ok) throw new Error(`fetch ${path} failed ${res.status}`)
    return await res.text()
  } catch (e) {
    console.warn('seed fetch failed', path, e)
    return null
  }
}

function parseCSV<T = any>(text: string | null) {
  if (!text) return [] as T[]
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true })
  return (parsed.data as unknown) as T[]
}

async function doSeed() {
  const teamsText = await fetchText('/samples/teams.csv')
  const catsText = await fetchText('/samples/categories.csv')
  const playerText = await fetchText('/samples/players.csv')

  const teamsRaw = parseCSV<{ name?: string; logo?: string; budget?: string }>(teamsText)
  const categoriesRaw = parseCSV<{ category?: string }>(catsText)
  const playersRaw = parseCSV<any>(playerText)

  const teams: Team[] = teamsRaw.map((r) => ({
    id: uuid(),
    name: (r.name || '').trim(),
    logo: (r.logo || '').trim(),
    players: [],
    budget: Number(r.budget ?? 100000),
  }))

  const categories: string[] = categoriesRaw
    .map((r) => r.category || '')
    .map((s) => s.trim())
    .filter(Boolean)

  // Fisher-Yates shuffle
  function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  const makePlayer = (r: any): Player => ({
    id: uuid(),
    name: (r.name || r.player || '').trim(),
    role: (r.role || r.position || '').trim(),
    category: (r.category || r.Category || '').trim(),
    photo: r.photo,
    basePrice: Number(r.basePrice || r.base || 0),
    sold: false,
    soldTo: null,
    soldPrice: null,
  })

  // shuffle the raw CSV records, then map to Player objects
  const players: Player[] = shuffle([...playersRaw]).map(makePlayer)

  // write to store
  saveStore({ teams, players, categories })
}

export async function seedIfEmpty() {
  const cur = loadStore()
  const empty = (!cur.teams || cur.teams.length === 0) && (!cur.players || cur.players.length === 0)
  if (!empty) return false
  try {
    await doSeed()
    return true
  } catch (e) {
    console.error('seeding failed', e)
    return false
  }
}

export async function forceSeed() {
  try {
    await doSeed()
    return true
  } catch (e) {
    console.error('forceSeed failed', e)
    return false
  }
}

export default null
