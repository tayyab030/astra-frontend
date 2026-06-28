"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchExchangeRates } from "@/lib/api/currency";
import { setExchangeRates } from "@/store/slice/currencySlice";
import { useAppDispatch } from "@/store/hooks";

const STALE_TIME_MS = 24 * 60 * 60 * 1000;

export function useExchangeRates() {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchExchangeRates,
    staleTime: STALE_TIME_MS,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(
        setExchangeRates({
          rates: query.data.rates,
          updatedAt: query.data.date,
        })
      );
    }
  }, [dispatch, query.data]);

  return query;
}
