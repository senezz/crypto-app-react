export function percentDifference(a: number, b: number): number {
  return +(100 * Math.abs((a - b) / ((a + b) / 2))).toFixed(2);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

export type ChartPoint = [timestamp: number, price: number];

/**
 * CoinStats chart points carry unix-seconds timestamps that don't line up
 * exactly with a transaction's saved date, so the closest available point
 * is used to place the buy/sell marker on the chart.
 */
export function findNearestChartPoint(
  transactionDate: Date,
  chartPoints: ChartPoint[],
): number {
  if (chartPoints.length === 0) return -1;

  const targetSeconds = transactionDate.getTime() / 1000;
  let nearestIndex = 0;
  let smallestDiff = Infinity;

  chartPoints.forEach(([timestamp], index) => {
    const diff = Math.abs(timestamp - targetSeconds);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}
