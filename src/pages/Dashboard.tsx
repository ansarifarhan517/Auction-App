import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import Papa from 'papaparse'
import { loadStore, saveStore, resetStore } from '../utils/storage'
import { forceSeed } from '../utils/seed'
import Card from '../components/Card'
import type { Player, Team } from '../types'
import { getLocalImageUrl } from './Auction'
import { useAppSelector } from '../store/hooks'

async function fileToDataUrl(file?: File | null): Promise<string | null> {
  if (!file) return null
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => {
      reader.abort()
      reject(new Error('Failed to read file'))
    }
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}

export default function Dashboard() {
  const mode = useAppSelector(state => state.theme.mode)
  const dark = mode === 'dark'

  // Empty initial state
  const [teams, setTeams] = useState<Team[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [players, setPlayers] = useState<Player[]>([])

  const prevRef = useRef({ teams: [], categories: [], players: [] })

  useEffect(() => {
    const s = loadStore()
    setTeams(s.teams || [])
    setCategories(s.categories || [])
    setPlayers(s.players || [])
  }, [])

  useEffect(() => {
    if (teams.length > 0 && categories.length > 0 && players.length > 0) {
      saveStore({ teams, categories, players })
    }
  }, [teams, categories, players])

  // NOTE: addTeam is now async because we may convert uploaded file to data URL
  const addTeam = async (e: any) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('teamName') as HTMLInputElement).value?.trim()
    const logoUrl = (form.elements.namedItem('teamLogo') as HTMLInputElement).value?.trim()
    const fileInput = form.elements.namedItem('teamLogoFile') as HTMLInputElement | null
    const file: File | null = fileInput?.files?.[0] ?? null

    if (!name) return

    // Prefer uploaded file -> convert to data URL, otherwise use the URL text input.
    let finalLogo: string | null = null
    try {
      const dataUrl = await fileToDataUrl(file)
      finalLogo = dataUrl ?? (logoUrl || null)
    } catch (err) {
      // If file read fails, fallback to provided URL
      finalLogo = logoUrl || null
      console.error('file read failed', err)
    }

    const team: Team = {
      id: uuid(),
      name,
      logo: finalLogo || '',
      players: [],
      budget: 100000
    }
    setTeams((s) => [...s, team])
    form.reset()
  }

  const addCategory = (e: any) => {
    e.preventDefault()
    const name = (e.target.elements.namedItem('categoryName') as HTMLInputElement).value
    if (!name) return
    setCategories((s) => Array.from(new Set([...s, name])))
    e.target.reset()
  }

  const handleCSV = (cat?: string) => (ev: any) => {
    const file = ev.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data as any[]
        const data: Player[] = rows.map((r) => ({
          id: uuid(),
          name: r.name || r.Name || r.player || '',
          role: r.role || r.Role || r.position || '',
          category: cat || r.category || r.Category || '',
          photo: r.photo || r.photoUrl || r.photoURL || '',
          basePrice: Number(r.basePrice || r.base || 0),
          sold: false,
          soldTo: null,
          soldPrice: null,
        }))
        setPlayers((p) => [...p, ...data])
        ev.target.value = ''
      },
    })
  }

  const baseInputClasses = `${dark
    ? '!bg-gray-700 border-gray-600 !text-white placeholder:text-gray-400 focus:ring-primary focus:border-primary'
    : '!bg-white border-gray-300 !text-black placeholder:text-gray-500 focus:ring-primary focus:border-primary'
  } w-full px-3 py-2 rounded transition`

  const baseButtonClasses = `${dark
    ? '!bg-blue-400 !text-black hover:bg-blue-600'
    : '!bg-orange-400 !text-black hover:bg-orange-300'
  } px-3 py-2 rounded font-semibold transition`

  return (
    <div className={`${dark ? '!bg-gray-900 text-white' : '!bg-white text-gray-900'} min-h-screen p-6 space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className={`${dark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Manage teams, categories and player uploads
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`${baseButtonClasses} ${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
            onClick={() => {
              if (!confirm('Reset all data?')) return
              resetStore()
              setTeams([])
              setCategories([])
              setPlayers([])
              prevRef.current = { teams: [], categories: [], players: [] }
            }}
          >
            Reset
          </button>

          <button
            className={`${baseButtonClasses} ${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}
            onClick={async () => {
              if (!confirm('Re-seed sample data?')) return
              try {
                await forceSeed()
                const s = loadStore()
                setTeams(s.teams || [])
                setCategories(s.categories || [])
                setPlayers(s.players || [])
              } catch (e) {
                console.error(e)
              }
            }}
          >
            Re-seed
          </button>
        </div>
      </div>

      {/* Main 3-column section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Teams */}
        <Card title="Teams">
          {/* Team form now supports either image URL (teamLogo) OR file upload (teamLogoFile) */}
          <form onSubmit={addTeam} className="space-y-3">
            <input name="teamName" placeholder="Team name" className={baseInputClasses} />

            {/* URL input for remote image */}
            <input name="teamLogo" placeholder="Logo URL (paste http... or leave blank to upload)" className={baseInputClasses} />

            {/* File upload for local image - will be stored as data URL */}
            <input
              name="teamLogoFile"
              type="file"
              accept="image/*"
              className={`${dark ? 'text-white' : 'text-black'} w-full`}
            />

            <div className="flex gap-2">
              <button type="submit" className={`${baseButtonClasses} ${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>Add Team</button>
              <button type="button" onClick={() => {
                // quick helper to clear forms if needed
                const form = document.querySelector('form') as HTMLFormElement | null
                form?.reset()
              }} className={`px-3 py-2 rounded border ${dark ? 'border-gray-600 text-white' : 'border-gray-300 text-black'}`}>
                Clear
              </button>
            </div>
          </form>

          <ul className="mt-4 space-y-2">
            {teams.map((t) => (
              <li key={t.id} className="flex items-center gap-3">
                <img
                  src={t.logo || 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80'}
                  alt={t.name}
                  onError={(e) => { const img = e.currentTarget as HTMLImageElement; img.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80&facepad=2&q=80' }}
                  className={`${dark ? 'bg-gray-700' : 'bg-gray-200'} w-10 h-10 rounded-full object-cover`}
                />
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className={`${dark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Players: {t.players.length}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Categories */}
        <Card title="Categories">
          <form onSubmit={addCategory} className="flex gap-2">
            <input name="categoryName" placeholder="Example: Batsman" className={baseInputClasses + ' flex-1'} />
            <button className={`${baseButtonClasses} ${dark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>Add</button>
          </form>

          <div className="mt-4">
            <div className={`${dark ? 'text-gray-300' : 'text-gray-500'} text-sm`}>Upload CSV per category</div>
            {categories.map((c) => (
              <label key={c} className={`${dark ? 'text-gray-200' : 'text-gray-700'} block mt-2 text-sm`}>
                <span className="font-medium">{c}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* CSV Players */}
        <Card title="Add Players (CSV)">
          <input type="file" accept=".csv" onChange={handleCSV()} className={baseInputClasses + ' mt-3'} />

          <div className="mt-4">
            <h3 className={`${dark ? 'text-white' : 'text-gray-900'} font-medium`}>All Players</h3>
            <ul className="mt-2 space-y-2 max-h-48 overflow-auto">
              {players.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <img
                    src={getLocalImageUrl(p.photo ? p.photo : '')}
                    alt={p.name}
                    className={`${dark ? 'bg-gray-700' : 'bg-gray-200'} w-10 h-10 rounded object-cover`}
                  />
                  <div>
                    <div className={`${dark ? 'text-white' : 'text-gray-900'} font-medium`}>{p.name}</div>
                    <div className={`${dark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{p.role} • {p.category}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  )
}
