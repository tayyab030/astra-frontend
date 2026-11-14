interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}

/**
 * Format an amount in the user's currency code.
 * No FX conversion — amounts are stored and shown in the account currency.
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: string,
  _rates?: Record<string, number>,
  options?: FormatCurrencyOptions
): string {
  const formatted = new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(Math.abs(amount));

  if (options?.showSign && amount > 0) {
    return `+${formatted}`;
  }

  if (amount < 0) {
    return `-${formatted}`;
  }

  return formatted;
}
