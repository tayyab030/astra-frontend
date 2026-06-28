import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BASE_CURRENCY } from "@/lib/currency/types";
import { revertAll } from "./resetStore";

interface CurrencyState {
  code: string;
  rates: Record<string, number>;
  ratesUpdatedAt: string | null;
}

const initialState: CurrencyState = {
  code: BASE_CURRENCY,
  rates: { [BASE_CURRENCY]: 1 },
  ratesUpdatedAt: null,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setExchangeRates: (
      state,
      action: PayloadAction<{ rates: Record<string, number>; updatedAt: string }>
    ) => {
      state.rates = { [BASE_CURRENCY]: 1, ...action.payload.rates };
      state.ratesUpdatedAt = action.payload.updatedAt;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const { setCurrency, setExchangeRates } = currencySlice.actions;
export default currencySlice.reducer;
