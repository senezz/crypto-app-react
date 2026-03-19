import { cryptoPortfolio } from "./data";
import type { Asset, Coin } from "./types/types";

export interface CoinApiResponse {
  result: Coin[];
}

export async function fakeFetchCrypto(): Promise<CoinApiResponse> {
  const apiKey = import.meta.env.VITE_COINSTATS_KEY;
  const options = {
    method: "GET",
    headers: { "X-API-KEY": apiKey },
  };

  return fetch("https://openapiv1.coinstats.app/coins", options)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

export function fetchPortfolio(): Promise<Asset[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoPortfolio);
    }, 2);
  });
}
