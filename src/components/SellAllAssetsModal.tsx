import { Modal, Typography, Flex, Button, Divider } from "antd";
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";

export default function SellAllAssetsModal({ asset, open, onClose }) {
  const { crypto, sellAsset } = useCrypto();
  const coin = crypto.find((c) => c.id === asset.id);
  const totalValue = (asset.amount * coin.price).toFixed(2);

  function handleConfirm() {
    sellAsset(asset.id, asset.amount);
    onClose();
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Confirm Sell All"
    >
      <CoinInfo coin={coin} withSymbol />
      <Divider />
      <Typography.Paragraph>
        Are you sure you want to sell{" "}
        <Typography.Text strong>
          {asset.amount} {asset.name}
        </Typography.Text>{" "}
        at the current price of{" "}
        <Typography.Text strong>${coin.price.toFixed(2)}</Typography.Text> per
        coin?
      </Typography.Paragraph>
      <Typography.Paragraph>
        You will receive{" "}
        <Typography.Text strong type="success">
          ${totalValue}
        </Typography.Text>
      </Typography.Paragraph>
      <Divider />
      <Flex gap="small" justify="flex-end">
        <Button onClick={onClose}>Cancel</Button>
        <Button type="primary" danger onClick={handleConfirm}>
          Sell All
        </Button>
      </Flex>
    </Modal>
  );
}
