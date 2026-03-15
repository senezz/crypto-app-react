import type { Asset } from "./types/types";
export function getCryptoData() {}

export const cryptoPortfolio: Asset[] = [
  {
    id: "bitcoin",
    amount: 0.02,
    price: 26244,
    date: new Date(),
  },
  {
    id: "ethereum",
    amount: 5,
    price: 2400,
    date: new Date(),
  },
];
