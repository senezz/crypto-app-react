import { useState } from "react";
import { Modal, Input, Typography, Flex, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

type VerifiedUser = { username: string; userId: number };

interface TelegramCodeModalProps {
  open: boolean;
  onClose: () => void;
  onOpenBot: () => void;
  onVerify: (code: string) => Promise<VerifiedUser>;
  onConfirm: (user: VerifiedUser) => void;
  onReject: () => void;
}

export default function TelegramCodeModal({
  open,
  onClose,
  onOpenBot,
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
    <Modal open={open} onCancel={handleClose} footer={null} title={null}>
      <Title level={5} style={{ margin: 0 }}>
        Connect Telegram
      </Title>

      {verifiedUser ? (
        <Flex vertical gap={12} style={{ marginTop: 12 }}>
          <Text>
            Found Telegram user{" "}
            <Text strong>@{verifiedUser.username}</Text>. Link this account?
          </Text>
          <Flex gap={8}>
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
        </Flex>
      ) : (
        <Flex vertical gap={12} style={{ marginTop: 4 }}>
          <Text type="secondary">
            Open the bot, send /start, then enter the code it gives you.
          </Text>

          <Button block onClick={onOpenBot}>
            Open bot ↗
          </Button>

          <Flex vertical gap={4}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Verification code
            </Text>
            <Input
              placeholder="123456"
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
          </Flex>

          <Button
            type="primary"
            block
            loading={loading}
            disabled={!code.trim()}
            onClick={handleSubmit}
          >
            Verify
          </Button>
        </Flex>
      )}
    </Modal>
  );
}
