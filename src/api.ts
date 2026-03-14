import { cryptoPortfolio } from "./data";

export async function fakeFetchCrypto() {
  const options = {
    method: "GET",
    headers: { "X-API-KEY": "b31jjX0fM+WeEqGcUTKHKRd3H5RwzYuaHzyhv9EgCM8=" },
  };

  return fetch("https://openapiv1.coinstats.app/coins", options)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

export function fetchPortfolio() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoPortfolio);
    }, 2);
  });
}
