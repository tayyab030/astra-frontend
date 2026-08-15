export interface Habit {
  id: string
  name: string
  streak: number
  completed: boolean
  target: number
  current: number
  frequency?: string
}
