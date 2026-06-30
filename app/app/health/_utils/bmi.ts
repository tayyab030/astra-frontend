import type { BmiStatus, BmiTone } from "../_types/health.types"

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBmiStatus(bmi: number | null): BmiStatus {
  if (bmi === null || bmi <= 0) {
    return { bmi: null, label: "Unknown", tone: "neutral" }
  }

  if (bmi >= 18.5 && bmi < 25) {
    return { bmi, label: "Healthy", tone: "green" }
  }

  if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi < 30)) {
    const label = bmi < 18.5 ? "Underweight" : "Overweight"
    return { bmi, label, tone: "yellow" }
  }

  const label = bmi < 17 ? "Underweight" : "Obese"
  return { bmi, label, tone: "red" }
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return { feet, inches }
}

export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54)
}

export function formatHeight(cm: number, unit: "cm" | "ftin"): string {
  if (unit === "cm") return `${cm} cm`
  const { feet, inches } = cmToFeetInches(cm)
  return `${feet}'${inches}"`
}

export function formatWeightKg(kg: number): string {
  return `${kg.toFixed(1)} kg`
}

const TONE_CLASSES: Record<BmiTone, { border: string; bg: string; text: string; badge: string }> = {
  green: {
    border: "border-emerald-500/40",
    bg: "from-emerald-950/40 to-slate-800/50",
    text: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  yellow: {
    border: "border-yellow-500/40",
    bg: "from-yellow-950/40 to-slate-800/50",
    text: "text-yellow-300",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  red: {
    border: "border-red-500/40",
    bg: "from-red-950/40 to-slate-800/50",
    text: "text-red-300",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  neutral: {
    border: "border-slate-600/50",
    bg: "from-slate-800/50 to-slate-700/50",
    text: "text-slate-300",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  },
}

export function getBmiToneClasses(tone: BmiTone) {
  return TONE_CLASSES[tone]
}
