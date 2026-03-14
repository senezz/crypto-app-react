import {
  Select,
  Space,
  Divider,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Result,
} from "antd";
import { useState, useRef } from "react";
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";
import {
  Asset,
  CryptoContextType,
  Coin,
  CryptoContextProps,
  Portfolio,
  Crypto,
} from "../types/types";

interface addAssetFormProps {
  onClose: () => void;
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

export default function AddAssetForm({ onClose }: addAssetFormProps) {
  const [form] = Form.useForm();
  const { crypto, addAsset } = useCrypto();
  const [coin, setCoin] = useState<Coin | null | undefined>(null);
  const [submitted, setSubmitted] = useState(false);
  const assetRef = useRef<Asset | undefined>(undefined);

  if (submitted) {
    let amount, price;
    const currentAsset = assetRef.current;
    if (currentAsset) {
      amount = (currentAsset as Asset).amount;
      price = (currentAsset as Asset).amount;
    }
    let coinName;
    if (coin) {
      coinName = coin.name;
    }

    return (
      <Result
        status="success"
        title="New Asset Added"
        subTitle={`Added ${amount} of ${coinName} by price ${price}`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>
            Close
          </Button>,
        ]}
      />
    );
  }

  if (!coin) {
    return (
      <Select
        style={{
          width: "100%",
        }}
        onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
        placeholder="Select coin"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />{" "}
            {option.data.label}
          </Space>
        )}
      />
    );
  }

  function onFinish(values: Asset) {
    const newAsset: Asset = {
      id: coin?.id ?? "",
      amount: values.amount,
      price: values.price,
      date: values.date ?? new Date(),
    };
    assetRef.current = newAsset;
    setSubmitted(true);
    addAsset(newAsset);
  }

  function handleAmountChange(value: number | null) {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: ((value ?? 0) * +price).toFixed(2),
    });
  }

  function handlePriceChange(value: number | null) {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: (+amount * (value ?? 0)).toFixed(2),
    });
  }

  return (
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
      initialValues={{
        price: +coin.price.toFixed(2),
      }}
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <CoinInfo coin={coin} />
      <Divider />

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            type: "number",
            min: 0,
          },
        ]}
      >
        <InputNumber
          placeholder="Enter coin amount"
          onChange={handleAmountChange}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Price" name="price">
        <InputNumber onChange={handlePriceChange} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Date & Time" name="date">
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label="Total" name="total">
        <InputNumber disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Asset
        </Button>
      </Form.Item>
    </Form>
  );
}
