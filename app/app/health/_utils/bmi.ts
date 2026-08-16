import type { BmiStatus, BmiTone } from "../_types/health.types"

/** WHO healthy BMI band: 18.5 – 24.9 */
const HEALTHY_BMI_MIN = 18.5
const HEALTHY_BMI_MAX = 24.9

export function calculateBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getHealthyWeightRangeKg(heightCm: number): {
  minKg: number
  maxKg: number
} {
  const heightM = heightCm / 100
  const h2 = heightM * heightM
  return {
    minKg: Math.round(HEALTHY_BMI_MIN * h2 * 10) / 10,
    maxKg: Math.round(HEALTHY_BMI_MAX * h2 * 10) / 10,
  }
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

function emptyBmiStatus(): BmiStatus {
  return {
    bmi: null,
    label: "Unknown",
    tone: "neutral",
    deltaKg: null,
    deltaLabel: null,
    healthyMinKg: null,
    healthyMaxKg: null,
    idealDeltaKg: null,
    idealDeltaLabel: null,
  }
}

function weightDeltaFields(
  weightKg: number | null | undefined,
  heightCm: number | null | undefined
): Pick<BmiStatus, "deltaKg" | "deltaLabel" | "healthyMinKg" | "healthyMaxKg"> {
  if (
    weightKg == null ||
    heightCm == null ||
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return {
      deltaKg: null,
      deltaLabel: null,
      healthyMinKg: null,
      healthyMaxKg: null,
    }
  }

  const { minKg, maxKg } = getHealthyWeightRangeKg(heightCm)

  if (weightKg > maxKg) {
    const over = round1(weightKg - maxKg)
    return {
      deltaKg: over,
      deltaLabel: `${over.toFixed(1)} kg over healthy weight`,
      healthyMinKg: minKg,
      healthyMaxKg: maxKg,
    }
  }

  if (weightKg < minKg) {
    const under = round1(minKg - weightKg)
    return {
      deltaKg: -under,
      deltaLabel: `${under.toFixed(1)} kg under healthy weight`,
      healthyMinKg: minKg,
      healthyMaxKg: maxKg,
    }
  }

  return {
    deltaKg: 0,
    deltaLabel: "Within healthy weight range",
    healthyMinKg: minKg,
    healthyMaxKg: maxKg,
  }
}

export function getIdealWeightDelta(
  weightKg: number | null | undefined,
  idealWeightKg: number | null | undefined
): Pick<BmiStatus, "idealDeltaKg" | "idealDeltaLabel"> {
  if (
    weightKg == null ||
    idealWeightKg == null ||
    weightKg <= 0 ||
    idealWeightKg <= 0
  ) {
    return { idealDeltaKg: null, idealDeltaLabel: null }
  }

  const diff = round1(weightKg - idealWeightKg)
  if (diff > 0) {
    return {
      idealDeltaKg: diff,
      idealDeltaLabel: `${diff.toFixed(1)} kg over your ideal weight`,
    }
  }
  if (diff < 0) {
    const under = round1(-diff)
    return {
      idealDeltaKg: -under,
      idealDeltaLabel: `${under.toFixed(1)} kg under your ideal weight`,
    }
  }
  return {
    idealDeltaKg: 0,
    idealDeltaLabel: "At your ideal weight",
  }
}

/** Returns an error message if ideal is outside the healthy band; otherwise null. */
export function validateIdealWeightKg(
  idealWeightKg: number,
  heightCm: number | null
): string | null {
  if (heightCm == null || heightCm <= 0) {
    return "Add your height before setting an ideal weight"
  }
  const { minKg, maxKg } = getHealthyWeightRangeKg(heightCm)
  if (idealWeightKg < minKg || idealWeightKg > maxKg) {
    return `Ideal weight must be within ${minKg.toFixed(1)}–${maxKg.toFixed(1)} kg`
  }
  return null
}

export function getBmiStatus(
  bmi: number | null,
  options?: {
    weightKg?: number | null
    heightCm?: number | null
    idealWeightKg?: number | null
  }
): BmiStatus {
  const delta = weightDeltaFields(options?.weightKg, options?.heightCm)
  const ideal = getIdealWeightDelta(options?.weightKg, options?.idealWeightKg)
  const extras = { ...delta, ...ideal }

  if (bmi === null || bmi <= 0) {
    return { ...emptyBmiStatus(), ...extras }
  }

  if (bmi >= HEALTHY_BMI_MIN && bmi < 25) {
    return { bmi, label: "Healthy", tone: "green", ...extras }
  }

  if ((bmi >= 17 && bmi < HEALTHY_BMI_MIN) || (bmi >= 25 && bmi < 30)) {
    const label = bmi < HEALTHY_BMI_MIN ? "Underweight" : "Overweight"
    return { bmi, label, tone: "yellow", ...extras }
  }

  const label = bmi < 17 ? "Underweight" : "Obese"
  return { bmi, label, tone: "red", ...extras }
}

/** Preferred helper when both weight and height are known. */
export function getBmiStatusFromMetrics(
  weightKg: number | null,
  heightCm: number | null,
  idealWeightKg: number | null = null
): BmiStatus {
  if (!weightKg || !heightCm) {
    return getBmiStatus(null, { weightKg, heightCm, idealWeightKg })
  }
  const bmi = calculateBmi(weightKg, heightCm)
  return getBmiStatus(bmi, { weightKg, heightCm, idealWeightKg })
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
