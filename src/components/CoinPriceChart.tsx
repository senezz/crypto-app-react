import { useMemo } from "react";
import { Flex, Typography } from "antd";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useCoinChartCache } from "../hooks/useCoinChartCache";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface CoinPriceChartProps {
  coinId: string;
  height?: number;
}

export default function CoinPriceChart({
  coinId,
  height = 140,
}: CoinPriceChartProps) {
  const { points, loading } = useCoinChartCache(coinId);

  const chartData = useMemo(() => {
    if (points.length === 0) return null;
    return {
      labels: points.map(([timestamp]) => timestamp),
      datasets: [
        {
          label: "price",
          data: points.map(([, price]) => price),
          borderColor: "#3ecf8e",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    };
  }, [points]);

  return (
    <div style={{ height, margin: "12px 0" }}>
      {chartData && !loading ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "nearest", intersect: false },
            scales: {
              x: { display: false },
              y: { display: false },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                padding: 10,
                titleFont: { size: 12 },
                bodyFont: { size: 14, weight: "bold" },
                boxPadding: 4,
                callbacks: {
                  title: (items) => {
                    const ts = points[items[0]?.dataIndex]?.[0];
                    return ts ? new Date(ts * 1000).toLocaleDateString() : "";
                  },
                  label: (item) => `$${item.formattedValue}`,
                },
              },
            },
          }}
        />
      ) : (
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Typography.Text type="secondary">
            {loading ? "Loading chart..." : "No chart data"}
          </Typography.Text>
        </Flex>
      )}
    </div>
  );
}
