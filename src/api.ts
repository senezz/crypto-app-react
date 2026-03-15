import { cryptoPortfolio } from "./data";
import type { Asset, Coin } from "./types/types";

export interface CoinApiResponse {
  result: Coin[];
}

export async function fakeFetchCrypto(): Promise<CoinApiResponse> {
  const options = {
    method: "GET",
    headers: { "X-API-KEY": "b31jjX0fM+WeEqGcUTKHKRd3H5RwzYuaHzyhv9EgCM8=" },
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
