import { Layout, Typography } from "antd";
import { useState } from "react";
import { useCrypto } from "../../context/crypto-context";
import AssetsTable from "../AssetsTable";
import PortfolioStats from "../PortfolioStats";
import HistoryModal from "../HistoryModal";
import { Coin } from "../../types/types";

type mapCoinPrice = {
  [key: string]: number;
};

const contentStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 60px)",
  color: "#f5f5f0",
  backgroundColor: "#141414",
  padding: "1.5rem",
};

export default function AppContent() {
  const { portfolio, crypto } = useCrypto();
  const [historyOpen, setHistoryOpen] = useState(false);

  const cryptoPriceMap = crypto.reduce((acc: mapCoinPrice, c: Coin) => {
    acc[c.id] = c.price;
    return acc;
  }, {});

  const totalPortfolio = portfolio
    .map((asset) => asset.amount * cryptoPriceMap[asset.id])
    .reduce((acc, v) => (acc += v), 0);

  const totalProfit = portfolio
    .map(
      (asset) =>
        asset.amount * cryptoPriceMap[asset.id] - asset.price * asset.amount,
    )
    .reduce((acc, v) => (acc += v), 0);

  const changePercent = totalPortfolio
    ? (totalProfit / totalPortfolio) * 100
    : 0;

  return (
    <Layout.Content style={contentStyle}>
      <Typography.Title level={3} style={{ textAlign: "left", marginBottom: 20 }}>
        Portfolio
      </Typography.Title>

      <PortfolioStats
        totalValue={totalPortfolio}
        changePercent={changePercent}
        assetsCount={portfolio.length}
        onHistoryClick={() => setHistoryOpen(true)}
      />

      <AssetsTable />

      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </Layout.Content>
  );
}
