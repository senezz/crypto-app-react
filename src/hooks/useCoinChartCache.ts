import { useEffect, useState } from "react";
import type { ChartPoint } from "../utils";

const CACHE_TTL_MS = 3 * 60 * 1000;

interface CacheEntry {
  points: ChartPoint[];
  fetchedAt: number;
}

const chartCache = new Map<string, CacheEntry>();

function isFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

export function useCoinChartCache(coinId: string | null) {
  const [points, setPoints] = useState<ChartPoint[]>(
    () => (coinId && chartCache.get(coinId)?.points) || [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;

    const cached = chartCache.get(coinId);
    if (cached) {
      setPoints(cached.points);
      if (isFresh(cached)) return;
    }

    let cancelled = false;
    if (!cached) setLoading(true);

    const apiKey = import.meta.env.VITE_COINSTATS_KEY;
    const url = `https://openapiv1.coinstats.app/coins/${coinId}/charts?period=1w`;

    fetch(url, {
      method: "GET",
      headers: { "X-API-KEY": apiKey },
    })
      .then(async (res) => {
        const rawText = await res.text();

        if (!res.ok) {
          throw new Error(
            `CoinStats charts request failed: ${res.status} ${rawText}`,
          );
        }

        const data: unknown = JSON.parse(rawText);
        const result: ChartPoint[] = Array.isArray(data)
          ? (data as ChartPoint[])
          : ((data as { result?: ChartPoint[] }).result ?? []);

        if (cancelled) return;
        chartCache.set(coinId, { points: result, fetchedAt: Date.now() });
        setPoints(result);
      })
      .catch((err) => console.error("[useCoinChartCache] failed", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coinId]);

  return { points, loading };
}
