import { useState } from "react";
import { Modal, Input, Typography, Space, message } from "antd";
import * as Auth from "../auth";

const { Text } = Typography;

interface TelegramCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
}

export default function TelegramCodeModal({
  open,
  onClose,
  onSubmit,
}: TelegramCodeModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Please enter the confirmation code.");
      return;
    }
    console.log(trimmed);
    onSubmit(trimmed);

    setError(null);
    setLoading(true);
    try {
      await onSubmit(trimmed);
      message.success("Telegram linked successfully!");
      handleClose();
    } catch (err: any) {
      setError(err?.message ?? "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      title={
        <Text style={{ color: "#4096ff", fontSize: 16 }}>
          Enter Telegram Confirmation Code
        </Text>
      }
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Cancel"
      confirmLoading={loading}
      okButtonProps={{ disabled: !code.trim() }}
      centered
    >
      <Space
        orientation="vertical"
        style={{ width: "100%", padding: "12px 0" }}
      >
        <Text type="secondary">
          Open the Telegram bot and copy the confirmation code it sent you.
        </Text>
        <Input
          size="large"
          placeholder="e.g. 123456"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          onPressEnter={handleSubmit}
          maxLength={32}
          //   style={{
          //     background: "#002a52",
          //     borderColor: error ? "#ff4d4f" : "rgba(64, 150, 255, 0.3)",
          //     color: "#fff",
          //   }}
          status={error ? "error" : undefined}
          autoFocus
        />
        {error && (
          <Text type="danger" style={{ fontSize: 13 }}>
            {error}
          </Text>
        )}
      </Space>
    </Modal>
  );
}
