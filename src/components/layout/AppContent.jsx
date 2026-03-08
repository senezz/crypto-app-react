import { Layout, Typography, Statistic, Flex, Tag } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useCrypto } from "../../context/crypto-context";
import PortfolioChart from "../PortfolioChart";
import AssetsTable from "../AssetsTable";

const contentStyle = {
  textAlign: "center",
  minHeight: "calc(100vh - 60px)",
  color: "#fff",
  backgroundColor: "#001529",
  padding: "1rem",
};

export default function AppContent() {
  const { portfolio, crypto } = useCrypto();

  const cryptoPriceMap = crypto.reduce((acc, c) => {
    acc[c.id] = c.price;
    return acc;
  }, {});

  const totalPortfolio = portfolio
    .map((asset) => asset.amount * cryptoPriceMap[asset.id])
    .reduce((acc, v) => (acc += v), 0)
    .toFixed(2);

  const totalProfit = portfolio
    .map(
      (asset) =>
        asset.amount * cryptoPriceMap[asset.id] - asset.price * asset.amount,
    )
    .reduce((acc, v) => (acc += v), 0)
    .toFixed(2);

  return (
    <Layout.Content style={contentStyle}>
      <Typography.Title level={3} style={{ textAlign: "left", color: "#fff" }}>
        Portfolio: {totalPortfolio}$
      </Typography.Title>
      <Flex
        gap="20px"
        justify="flex-start"
        align="center"
        style={{ width: "100%" }}
      >
        <Statistic
          value={Math.abs(totalProfit)}
          precision={2}
          styles={{
            content: { color: totalProfit > 0 ? "#60be0e" : "#e63948" },
          }}
          prefix={totalProfit > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          suffix="$"
        />
        <Tag
          style={{
            padding: "2px 5px",
            fontWeight: "bold",
            backgroundColor: totalProfit > 0 ? "#d1f5b2" : "#be8489",
          }}
          color={totalProfit > 0 ? "#4c9b07" : "#b81927"}
        >
          {Math.abs((totalProfit / totalPortfolio) * 100).toFixed(2)}%
        </Tag>
      </Flex>
      <PortfolioChart />
      <AssetsTable />
    </Layout.Content>
  );
}
