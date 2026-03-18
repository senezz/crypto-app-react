import { useState } from "react";
import { Modal, Input, Typography, Space, Button, Flex } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

type VerifiedUser = { username: string; userId: number };

interface TelegramCodeModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<VerifiedUser>;
  onConfirm: (user: VerifiedUser) => void;
  onReject: () => void;
}

export default function TelegramCodeModal({
  open,
  onClose,
  onVerify,
  onConfirm,
  onReject,
}: TelegramCodeModalProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  const handleSubmit = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Please enter the confirmation code.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const user = await onVerify(trimmed);
      setVerifiedUser(user);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Invalid code. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(null);
    setVerifiedUser(null);
    onClose();
  };

  const handleConfirm = () => {
    if (verifiedUser) {
      onConfirm(verifiedUser);
    }
    handleClose();
  };

  const handleReject = () => {
    onReject();
    handleClose();
  };

  return (
    <Modal
      open={open}
      title={
        <Text style={{ color: "#4096ff", fontSize: 16 }}>
          {verifiedUser
            ? "Confirm your Telegram account"
            : "Enter Telegram Confirmation Code"}
        </Text>
      }
      onCancel={handleClose}
      footer={null}
      centered
    >
      {verifiedUser ? (
        <Space
          orientation="vertical"
          style={{ width: "100%", padding: "12px 0" }}
        >
          <Text>
            Found Telegram user:{" "}
            <Text strong style={{ color: "#4096ff" }}>
              @{verifiedUser.username}
            </Text>
          </Text>
          <Text type="secondary">Do you want to link this account?</Text>
          <Flex gap={8} style={{ marginTop: 8 }}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleConfirm}
              style={{ flex: 1 }}
            >
              Confirm
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={handleReject}
              style={{ flex: 1 }}
            >
              Reject
            </Button>
          </Flex>
        </Space>
      ) : (
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
            maxLength={6}
            status={error ? "error" : undefined}
            autoFocus
          />
          {error && (
            <Text type="danger" style={{ fontSize: 13 }}>
              {error}
            </Text>
          )}
          <Button
            type="primary"
            loading={loading}
            disabled={!code.trim()}
            onClick={handleSubmit}
            style={{ width: "100%", marginTop: 4 }}
          >
            Submit
          </Button>
        </Space>
      )}
    </Modal>
  );
}
