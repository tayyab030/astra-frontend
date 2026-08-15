"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchGoalsQuote, type DailyQuoteResponse } from "@/lib/api/assistant"

const FALLBACK_QUOTE = "A goal is a dream with a deadline."

const STORAGE_KEY = "astra-goals-quote"
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000

type StoredQuote = {
  quote: string
  fetchedAt: number
}

function readLocalQuote(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredQuote
    if (
      typeof parsed.quote === "string" &&
      parsed.quote.trim() &&
      typeof parsed.fetchedAt === "number" &&
      Date.now() - parsed.fetchedAt < TWELVE_HOURS_MS
    ) {
      return parsed.quote.trim()
    }
  } catch {
    // ignore corrupt storage
  }
  return null
}

function writeLocalQuote(quote: string) {
  try {
    const payload: StoredQuote = { quote, fetchedAt: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // ignore quota / private mode
  }
}

async function loadQuote(): Promise<DailyQuoteResponse> {
  const local = readLocalQuote()
  if (local) {
    return {
      quote: local,
      date: new Date().toISOString().slice(0, 10),
      source: "cache",
    }
  }

  const data = await fetchGoalsQuote()
  const quote = data.quote?.trim() || FALLBACK_QUOTE
  writeLocalQuote(quote)
  return { ...data, quote }
}

export function useGoalsQuote() {
  const query = useQuery({
    queryKey: ["goals-quote"],
    queryFn: loadQuote,
    staleTime: TWELVE_HOURS_MS,
    gcTime: TWELVE_HOURS_MS,
    refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: () => {
      const local = readLocalQuote()
      return {
        quote: local ?? FALLBACK_QUOTE,
        date: new Date().toISOString().slice(0, 10),
        source: local ? ("cache" as const) : ("fallback" as const),
      }
    },
  })

  return {
    quote: query.data?.quote?.trim() || FALLBACK_QUOTE,
    isLoading: query.isLoading && !query.data,
  }
}
