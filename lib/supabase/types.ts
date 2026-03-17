export type UserRole = 'admin' | 'member'
export type CardType = '5er' | '10er' | 'schnupper'
export type BookingStatus = 'active' | 'cancelled'

export interface Profile {
  id: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
}

export interface ClubCard {
  id: string
  user_id: string
  type: CardType
  total_units: number
  used_units: number
  valid_until: string
  created_at: string
}

export interface Session {
  id: string
  starts_at: string
  max_participants: number
  created_at: string
}

export interface Booking {
  id: string
  session_id: string
  user_id: string
  card_id: string
  status: BookingStatus
  cancelled_at: string | null
  created_at: string
}

export interface SessionAttendee {
  session_id: string
  first_name: string
}
