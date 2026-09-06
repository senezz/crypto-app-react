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
    const url = `https://openapiv1.coinstats.app/coins/${coinId}/charts?period=1w`;

    fetch(url, {
      method: "GET",
      headers: { "X-API-KEY": apiKey },
    })
      .then(async (res) => {
        const rawText = await res.text();
        console.log("[useCoinChart] request", { coinId, url });
        console.log("[useCoinChart] response status", res.status);
        console.log("[useCoinChart] response body", rawText);

        if (!res.ok) {
          throw new Error(
            `CoinStats charts request failed: ${res.status} ${rawText}`,
          );
        }

        const data: unknown = JSON.parse(rawText);
        // CoinStats returns the charts payload as a bare array of
        // [timestamp, price, ...] tuples, not { result: [...] } as
        // other CoinStats endpoints do - handle both just in case.
        const result: ChartPoint[] = Array.isArray(data)
          ? (data as ChartPoint[])
          : ((data as { result?: ChartPoint[] }).result ?? []);

        if (cancelled) return;
        chartCache.set(coinId, result);
        setPoints(result);
      })
      .catch((err) => console.error("[useCoinChart] failed", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coinId]);

  return { points, loading };
}
