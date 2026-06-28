"use client";

import { useCallback } from "react";
import { BASE_CURRENCY } from "@/lib/currency/types";
import { formatCurrencyAmount } from "@/lib/currency/format";
import { setCurrency } from "@/store/slice/currencySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useExchangeRates } from "./useExchangeRates";

interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}

export function useCurrency() {
  const dispatch = useAppDispatch();
  const { code, rates } = useAppSelector((state) => state.currency);

  useExchangeRates();

  const formatCurrency = useCallback(
    (amountInUsd: number, options?: FormatCurrencyOptions) =>
      formatCurrencyAmount(amountInUsd, code, rates, options),
    [code, rates]
  );

  const changeCurrency = useCallback(
    (nextCode: string) => {
      dispatch(setCurrency(nextCode));
    },
    [dispatch]
  );

  return {
    currency: code,
    baseCurrency: BASE_CURRENCY,
    formatCurrency,
    setCurrency: changeCurrency,
  };
}
