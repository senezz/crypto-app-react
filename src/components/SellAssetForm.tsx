import { useMemo, useState } from "react";
import { Button, DatePicker, Flex, InputNumber, Modal, Typography } from "antd";
import type { Dayjs } from "dayjs";
import { useCrypto } from "../context/crypto-context";
import { Asset } from "../types/types";

interface SellAssetFormProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

export default function SellAssetForm({
  asset,
  open,
  onClose,
}: SellAssetFormProps) {
  const { crypto, sellAsset } = useCrypto();
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState<Dayjs | null>(null);
  const coin = crypto.find((c) => c.id === asset.id);

  const error = useMemo(() => {
    if (amount === null) return null;
    if (amount <= 0) return "Enter an amount greater than 0";
    if (amount > asset.amount) return "You don't have enough coins";
    return null;
  }, [amount, asset.amount]);

  if (!coin) return null;

  const willReceive = amount && !error ? amount * coin.price : 0;

  function handleClose() {
    setAmount(null);
    setDate(null);
    onClose();
  }

  function handleSell() {
    if (!amount || error) return;
    sellAsset(asset.id, amount, date?.toDate());
    handleClose();
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title="Confirm sell"
      destroyOnHidden
    >
      <Flex align="center" gap={10} style={{ marginBottom: 16 }}>
        {coin.icon && <img src={coin.icon} alt={coin.name} width={24} />}
        <Typography.Text strong>
          {coin.name} ({coin.symbol?.toUpperCase()})
        </Typography.Text>
      </Flex>

      <Flex
        vertical
        gap={8}
        style={{
          padding: 12,
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Flex justify="space-between">
          <Typography.Text type="secondary">You hold</Typography.Text>
          <Typography.Text>{asset.amount.toFixed(4)}</Typography.Text>
        </Flex>
        <Flex justify="space-between">
          <Typography.Text type="secondary">Avg buy price</Typography.Text>
          <Typography.Text type="secondary">
            ${asset.price.toFixed(2)}
          </Typography.Text>
        </Flex>
        <Flex justify="space-between">
          <Typography.Text type="secondary">Current price</Typography.Text>
          <Typography.Text strong style={{ color: "#3ecf8e" }}>
            ${coin.price.toFixed(2)}
          </Typography.Text>
        </Flex>
      </Flex>

      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        Amount to sell
      </Typography.Text>
      <InputNumber
        placeholder="0.00"
        value={amount}
        onChange={setAmount}
        style={{ width: "100%", marginTop: 4 }}
        min={0}
        max={asset.amount}
        step={0.0001}
        status={error ? "error" : undefined}
      />
      {error && (
        <Typography.Text type="danger" style={{ fontSize: 13 }}>
          {error}
        </Typography.Text>
      )}

      <Typography.Text
        type="secondary"
        style={{ fontSize: 12, display: "block", marginTop: 12 }}
      >
        Sell date
      </Typography.Text>
      <DatePicker
        value={date}
        onChange={setDate}
        placeholder="Today"
        style={{ width: "100%", marginTop: 4 }}
      />

      {willReceive > 0 && (
        <Typography.Paragraph style={{ marginTop: 12, marginBottom: 0 }}>
          You will receive{" "}
          <Typography.Text strong style={{ color: "#3ecf8e" }}>
            ${willReceive.toFixed(2)}
          </Typography.Text>
        </Typography.Paragraph>
      )}

      <Flex gap={8} style={{ marginTop: 20 }}>
        <Button block onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          danger
          block
          disabled={!amount || !!error}
          onClick={handleSell}
        >
          Sell
        </Button>
      </Flex>
    </Modal>
  );
}
