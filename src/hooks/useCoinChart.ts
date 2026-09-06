import { useEffect, useState } from "react";
import type { ChartPoint } from "../utils";

// Module-level cache so re-opening the detail modal for the same coin
// within a session never re-hits CoinStats' rate-limited free tier.
const chartCache = new Map<string, ChartPoint[]>();

export function useCoinChart(coinId: string | null) {
  const [points, setPoints] = useState<ChartPoint[]>(
    coinId ? (chartCache.get(coinId) ?? []) : [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const cached = chartCache.get(coinId);
    if (cached) {
      setPoints(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const apiKey = import.meta.env.VITE_COINSTATS_KEY;
    fetch(`https://openapiv1.coinstats.app/coins/${coinId}/charts?period=1w`, {
      method: "GET",
      headers: { "X-API-KEY": apiKey },
    })
      .then((res) => res.json())
      .then((data: { result: ChartPoint[] }) => {
        if (cancelled) return;
        const result = data.result ?? [];
        chartCache.set(coinId, result);
        setPoints(result);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coinId]);

  return { points, loading };
}
