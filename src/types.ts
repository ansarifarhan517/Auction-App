export type Team = {
  id: string
  name: string
  logo?: string
  players: string[]
  budget: number
}

export type Player = {
  id: string
  name: string
  role?: string
  category?: string
  photo?: string
  basePrice?: number
  sold?: boolean
  soldTo?: string | null
  soldPrice?: number | null
}
