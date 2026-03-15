import {
  Typography,
  Flex,
  Divider,
  Form,
  InputNumber,
  Button,
  Modal,
  message,
} from "antd";
import { useState } from "react";
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";
import { Asset, SellFormValues } from "../types/types";

interface SellAssetFormProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

const validateMessages = {
  required: "${label} is required!",
  types: { number: "${label} in not valid number" },
  number: { range: "${label} must be between ${min} and ${max}" },
};

export default function SellAssetForm({
  asset,
  open,
  onClose,
}: SellAssetFormProps) {
  const [form] = Form.useForm();
  const { crypto, sellAsset } = useCrypto();
  const [total, setTotal] = useState(0);
  const coin = crypto.find((c) => c.id === asset.id);
  if (!coin) return null;

  function minValueOfCoin() {
    return 0.0001;
  }

  function onFinish(values: SellFormValues) {
    sellAsset(asset.id, values.amount);
    onClose();
  }

  function handleAmountChange(amount: number | null) {
    if (!amount) {
      setTotal(0);
      return;
    }
    const decimals = amount.toString().split(".")[1];
    if (decimals && decimals.length > 4) {
      form.resetFields(["amount"]);
      setTotal(0);
      message.error("No more than 4 decimal places allowed");
      return;
    }
    setTotal(+(amount * coin!.price).toFixed(2));
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Confirm Sell Asset"
      destroyOnHidden
    >
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 10,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <CoinInfo coin={coin} withSymbol />
        <Divider />
        <Typography.Paragraph>
          You currently hold{" "}
          <Typography.Text strong>
            {asset.amount.toFixed(4)} {asset.name}
          </Typography.Text>{" "}
          at the current price of{" "}
          <Typography.Text strong>${coin.price.toFixed(2)}</Typography.Text> per
          coin.
        </Typography.Paragraph>
        <Typography.Paragraph>
          How much would you like to sell?
        </Typography.Paragraph>
        <Divider />
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              type: "number",
              min: minValueOfCoin(),
              max: asset.amount,
              message: "You don't have enough coins",
            },
            {
              validator(_, amount) {
                if (amount && amount.toString().split(".")[1]?.length > 4) {
                  return Promise.reject(
                    "No more than 4 decimal places allowed",
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            placeholder="Enter coin amount"
            onChange={handleAmountChange}
            style={{ width: "100%" }}
            min={0}
            max={asset.amount}
            step={0.0001}
          />
        </Form.Item>
        {total > 0 && (
          <>
            <Typography.Paragraph>
              You will receive{" "}
              <Typography.Text strong type="success">
                ${total}
              </Typography.Text>
            </Typography.Paragraph>
            <Divider />
          </>
        )}
        <Form.Item wrapperCol={{ span: 24 }}>
          <Flex gap="small" justify="flex-end" style={{ width: "100%" }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" danger htmlType="submit">
              Sell
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
}
