import { useMemo, useState } from "react";
import { Button, Flex, Modal, Typography } from "antd";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  type Plugin,
  type ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useCrypto } from "../context/crypto-context";
import { useCoinChart } from "../hooks/useCoinChart";
import { findNearestChartPoint } from "../utils";
import SellAssetForm from "./SellAssetForm";
import AddAssetForm from "./AddAssetForm";
import type { Asset } from "../types/types";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
}

// Draws a "+"/"-" glyph on top of the buy/sell marker points, since
// Chart.js has no built-in way to label individual points.
const markerGlyphPlugin: Plugin<"line"> = {
  id: "markerGlyph",
  afterDatasetsDraw(chart) {
    const datasetIndex = chart.data.datasets.findIndex(
      (d) => d.label === "markers",
    );
    if (datasetIndex === -1) return;
    const meta = chart.getDatasetMeta(datasetIndex);
    const glyphs = (chart.data.datasets[datasetIndex] as { glyphs?: string[] })
      .glyphs;
    if (!glyphs) return;

    const ctx = chart.ctx;
    meta.data.forEach((point, index) => {
      const glyph = glyphs[index];
      if (!glyph) return;
      ctx.save();
      ctx.fillStyle = "#141414";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(glyph, point.x, point.y);
      ctx.restore();
    });
  },
};

export default function AssetDetailModal({
  asset,
  onClose,
}: AssetDetailModalProps) {
  const { crypto, transactions } = useCrypto();
  const [sellOpen, setSellOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const coin = crypto.find((c) => c.id === asset.id);
  const { points, loading } = useCoinChart(asset.id);

  const assetTransactions = useMemo(
    () => transactions.filter((t) => t.coinId === asset.id),
    [transactions, asset.id],
  );

  const chartData: ChartData<"line"> | null = useMemo(() => {
    if (points.length === 0) return null;

    const buyIndices = new Set<number>();
    const sellIndices = new Set<number>();
    assetTransactions.forEach((t) => {
      const index = findNearestChartPoint(new Date(t.date), points);
      if (index === -1) return;
      if (t.type === "buy") buyIndices.add(index);
      else sellIndices.add(index);
    });

    const markerValues = points.map(([, price], index) =>
      buyIndices.has(index) || sellIndices.has(index) ? price : NaN,
    );
    const markerColors = points.map(([], index) =>
      buyIndices.has(index) ? "#3ecf8e" : "#e5484d",
    );
    const markerRadii = points.map(([], index) =>
      buyIndices.has(index) || sellIndices.has(index) ? 8 : 0,
    );
    const glyphs = points.map(([], index) =>
      buyIndices.has(index) ? "+" : sellIndices.has(index) ? "-" : "",
    );

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
        {
          label: "markers",
          data: markerValues,
          pointBackgroundColor: markerColors,
          pointBorderColor: markerColors,
          pointRadius: markerRadii,
          borderWidth: 0,
          showLine: false,
          spanGaps: false,
          // consumed by markerGlyphPlugin, not a real Chart.js dataset option
          glyphs,
        } as ChartData<"line">["datasets"][number],
      ],
    };
  }, [points, assetTransactions]);

  if (!coin) return null;

  const totalValue = asset.amount * coin.price;
  const positive = !!asset.grow;

  return (
    <>
      <Modal open onCancel={onClose} footer={null} title={null} width={500}>
        <Flex align="center" gap={10} style={{ marginBottom: 4 }}>
          {coin.icon && <img src={coin.icon} alt={coin.name} width={24} />}
          <Typography.Text strong>{coin.name}</Typography.Text>
        </Flex>

        <Flex align="baseline" gap={8}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            ${coin.price.toFixed(2)}
          </Typography.Title>
          {asset.growPercent !== undefined && (
            <Typography.Text style={{ color: positive ? "#3ecf8e" : "#e5484d" }}>
              {positive ? "+" : "-"}
              {asset.growPercent}%
            </Typography.Text>
          )}
        </Flex>

        <div style={{ height: 220, margin: "16px 0" }}>
          {chartData && !loading ? (
            <Line
              data={chartData}
              plugins={[markerGlyphPlugin]}
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
                        return ts
                          ? new Date(ts * 1000).toLocaleDateString()
                          : "";
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

        <Flex vertical gap={8} style={{ marginBottom: 20 }}>
          <Flex justify="space-between">
            <Typography.Text type="secondary">You hold</Typography.Text>
            <Typography.Text>
              {asset.amount.toFixed(4)} {coin.symbol?.toUpperCase()}
            </Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text type="secondary">Avg buy price</Typography.Text>
            <Typography.Text>${asset.price.toFixed(2)}</Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text type="secondary">Current price</Typography.Text>
            <Typography.Text strong>${coin.price.toFixed(2)}</Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text type="secondary">Total value</Typography.Text>
            <Typography.Text strong>${totalValue.toFixed(2)}</Typography.Text>
          </Flex>
        </Flex>

        <Flex gap={8}>
          <Button danger block onClick={() => setSellOpen(true)}>
            Sell
          </Button>
          <Button type="primary" block onClick={() => setAddOpen(true)}>
            Add more
          </Button>
        </Flex>
      </Modal>

      <SellAssetForm
        asset={asset}
        open={sellOpen}
        onClose={() => setSellOpen(false)}
      />

      <Modal
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        footer={null}
        title="Add more"
        destroyOnHidden
      >
        <AddAssetForm
          onClose={() => setAddOpen(false)}
          defaultCoinId={asset.id}
        />
      </Modal>
    </>
  );
}
