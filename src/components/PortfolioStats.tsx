import { Card, Flex, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";

interface PortfolioStatsProps {
  totalValue: number;
  changePercent: number;
  assetsCount: number;
  onHistoryClick: () => void;
}

const tileStyle: CSSProperties = {
  flex: "1 1 160px",
  minWidth: 140,
};

export default function PortfolioStats({
  totalValue,
  changePercent,
  assetsCount,
  onHistoryClick,
}: PortfolioStatsProps) {
  const positive = changePercent >= 0;

  return (
    <Flex gap={12} wrap style={{ marginBottom: 20 }}>
      <Card style={tileStyle} styles={{ body: { padding: 16 } }}>
        <Flex vertical gap={4} align="flex-start">
          <Typography.Text type="secondary">Total value</Typography.Text>
          <Typography.Title level={4} style={{ margin: 0 }}>
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Typography.Title>
        </Flex>
      </Card>
      <Card style={tileStyle} styles={{ body: { padding: 16 } }}>
        <Flex vertical gap={4} align="flex-start">
          <Typography.Text type="secondary">24h change</Typography.Text>
          <Typography.Title
            level={4}
            style={{ margin: 0, color: positive ? "#3ecf8e" : "#e5484d" }}
          >
            {positive ? "+" : ""}
            {changePercent.toFixed(1)}%
          </Typography.Title>
        </Flex>
      </Card>
      <Card style={tileStyle} styles={{ body: { padding: 16 } }}>
        <Flex vertical gap={4} align="flex-start">
          <Typography.Text type="secondary">Assets</Typography.Text>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {assetsCount}
          </Typography.Title>
        </Flex>
      </Card>
      <Card
        hoverable
        onClick={onHistoryClick}
        style={{ ...tileStyle, cursor: "pointer" }}
        styles={{ body: { padding: 16 } }}
      >
        <Flex vertical gap={4} align="flex-start">
          <Typography.Text type="secondary">History</Typography.Text>
          <Typography.Title level={4} style={{ margin: 0 }}>
            <ArrowRightOutlined />
          </Typography.Title>
        </Flex>
      </Card>
    </Flex>
  );
}
