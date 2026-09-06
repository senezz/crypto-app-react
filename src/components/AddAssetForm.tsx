import {
  Select,
  Space,
  Flex,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Typography,
} from "antd";
import { useState } from "react";
import { useCrypto } from "../context/crypto-context";
import { Asset, Coin } from "../types/types";

interface addAssetFormProps {
  onClose: () => void;
  defaultCoinId?: string;
}

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} in not valid number",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export default function AddAssetForm({
  onClose,
  defaultCoinId,
}: addAssetFormProps) {
  const [form] = Form.useForm();
  const { crypto, addAsset } = useCrypto();
  const [coin, setCoin] = useState<Coin | null>(
    () => crypto.find((c) => c.id === defaultCoinId) ?? null,
  );

  function handleSelectCoin(value: string) {
    const selected = crypto.find((c) => c.id === value) ?? null;
    setCoin(selected);
    form.setFieldsValue({ price: selected ? +selected.price.toFixed(2) : undefined });
  }

  function onFinish(values: { amount: number; price: number; date?: unknown }): void {
    if (!coin) return;
    const newAsset: Asset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date ? new Date(values.date as string) : new Date(),
    };
    addAsset(newAsset);
    onClose();
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      validateMessages={validateMessages}
      initialValues={{
        coinId: coin?.id,
        price: coin ? +coin.price.toFixed(2) : undefined,
      }}
    >
      <Form.Item
        label="Coin"
        name="coinId"
        rules={[{ required: true, message: "Please select a coin" }]}
      >
        <Select
          placeholder="Select coin"
          onSelect={handleSelectCoin}
          options={crypto.map((c) => ({
            label: c.name,
            value: c.id,
            icon: c.icon,
          }))}
          optionRender={(option) => (
            <Space>
              <img
                style={{ width: 20 }}
                src={option.data.icon}
                alt={option.data.label}
              />
              {option.data.label}
            </Space>
          )}
          labelRender={(option) => {
            const selected = crypto.find((c) => c.id === option.value);
            return (
              <Space>
                {selected?.icon && (
                  <img style={{ width: 20 }} src={selected.icon} alt="" />
                )}
                {option.label}
              </Space>
            );
          }}
        />
      </Form.Item>

      <Flex gap={12}>
        <Form.Item
          label="Amount"
          name="amount"
          style={{ flex: 1 }}
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber
            placeholder="0.00"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="Price paid"
          name="price"
          style={{ flex: 1 }}
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber
            placeholder="$0.00"
            style={{ width: "100%" }}
            min={0}
          />
        </Form.Item>
      </Flex>

      <Form.Item label="Purchase date" name="date">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      {!coin && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Select a coin to continue
        </Typography.Text>
      )}

      <Flex gap={8} style={{ marginTop: 8 }}>
        <Button block onClick={onClose}>
          Cancel
        </Button>
        <Button type="primary" block htmlType="submit">
          Add asset
        </Button>
      </Flex>
    </Form>
  );
}
