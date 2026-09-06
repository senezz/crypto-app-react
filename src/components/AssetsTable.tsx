import { Card, Flex, Tag, Typography } from "antd";
import { useState } from "react";
import { useCrypto } from "../context/crypto-context";
import AssetDetailModal from "./AssetDetailModal";
import type { Asset, Coin } from "../types/types";

export default function AssetsTable() {
  const { portfolio, crypto } = useCrypto();
  const [selected, setSelected] = useState<Asset | null>(null);

  const coinById = new Map(crypto.map((c) => [c.id, c]));

  return (
    <>
      <Flex wrap gap={16}>
        {portfolio.map((asset) => {
          const coin: Coin | undefined = coinById.get(asset.id);
          const totalValue = coin ? asset.amount * coin.price : 0;
          const positive = !!asset.grow;

          return (
            <Card
              key={asset.id}
              hoverable
              onClick={() => setSelected(asset)}
              style={{ flex: "1 1 320px", minWidth: 280, cursor: "pointer" }}
              styles={{ body: { padding: 16 } }}
            >
              <Flex justify="space-between" align="flex-start">
                <Flex align="center" gap={10}>
                  {coin?.icon && (
                    <img
                      src={coin.icon}
                      alt={asset.name}
                      width={28}
                      height={28}
                    />
                  )}
                  <Typography.Text strong>
                    {asset.name ?? asset.id}
                  </Typography.Text>
                </Flex>
                {asset.growPercent !== undefined && (
                  <Tag color={positive ? "success" : "error"}>
                    {positive ? "+" : "-"}
                    {asset.growPercent}%
                  </Tag>
                )}
              </Flex>

              <Typography.Title level={3} style={{ margin: "12px 0 0" }}>
                ${totalValue.toFixed(2)}
              </Typography.Title>
              <Typography.Text type="secondary">
                {asset.amount.toFixed(4)}{" "}
                {coin?.symbol?.toUpperCase() ?? asset.id.toUpperCase()}
              </Typography.Text>

              <Flex
                justify="space-between"
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: "1px solid #2a2a2a",
                }}
              >
                <Flex vertical>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Avg buy price
                  </Typography.Text>
                  <Typography.Text>${asset.price.toFixed(2)}</Typography.Text>
                </Flex>
                <Flex vertical align="flex-end">
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Current price
                  </Typography.Text>
                  <Typography.Text strong>
                    ${coin ? coin.price.toFixed(2) : "-"}
                  </Typography.Text>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>

      {selected && (
        <AssetDetailModal
          asset={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
