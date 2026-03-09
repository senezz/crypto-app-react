import {
  Layout,
  Card,
  Statistic,
  List,
  Typography,
  Tag,
  Button,
  Space,
} from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { capitalize } from "../../utils";
import { useContext, useState } from "react";
import CryptoContext from "../../context/crypto-context";
import SellAssetForm from "../SellAssetForm";
import SellAllAssetsModal from "../SellAllAssetsModal";

const siderStyle = {
  padding: "1rem",
};

export default function AppSider() {
  const { portfolio, sellAsset } = useContext(CryptoContext);
  const [forSellAsset, setForSellAsset] = useState(null);
  const [forSellAllAsset, setForSellAllAsset] = useState(null);

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {portfolio.map((asset) => (
        <Card key={asset.id} style={{ marginBottom: "1rem", minWidth: 220 }}>
          <Statistic
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <span>{capitalize(asset.id)}</span>
                <Space>
                  <Button
                    onClick={() => {
                      setForSellAsset(asset);
                    }}
                  >
                    Sell
                  </Button>
                  <Button onClick={() => setForSellAllAsset(asset)}>
                    Sell All
                  </Button>
                </Space>
              </div>
            }
            value={asset.totalAmount}
            precision={2}
            styles={{ content: { color: asset.grow ? "#3f8600" : "#cf1322" } }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
            size="small"
            dataSource={[
              {
                title: "Total Profit",
                value: asset.totalProfit,
                withTag: true,
              },
              { title: "Asset Amount", value: asset.amount, isPlain: true },
              // { title: 'Difference', value: asset.growPercent },
            ]}
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? "green" : "red"}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlain && item.value.toFixed(4)}
                  {!item.isPlain && (
                    <Typography.Text type={asset.grow ? "success" : "danger"}>
                      {item.value.toFixed(2)}$
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
      {forSellAsset && (
        <SellAssetForm
          asset={forSellAsset}
          open={!!forSellAsset}
          onClose={() => setForSellAsset(null)}
        />
      )}
      {forSellAllAsset && (
        <SellAllAssetsModal
          asset={forSellAllAsset}
          open={!!forSellAllAsset}
          onClose={() => setForSellAllAsset(null)}
        />
      )}
    </Layout.Sider>
  );
}
