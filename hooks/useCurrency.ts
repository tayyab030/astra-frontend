"use client";

import { useCallback } from "react";
import { BASE_CURRENCY } from "@/lib/currency/types";
import { formatCurrencyAmount } from "@/lib/currency/format";
import { setCurrency } from "@/store/slice/currencySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSign?: boolean;
}

export function useCurrency() {
  const dispatch = useAppDispatch();
  const { code } = useAppSelector((state) => state.currency);

  const formatCurrency = useCallback(
    (amount: number, options?: FormatCurrencyOptions) =>
      formatCurrencyAmount(amount, code, undefined, options),
    [code]
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
