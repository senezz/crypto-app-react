import { Empty, Flex, List, Modal, Typography } from "antd";
import { useCrypto } from "../context/crypto-context";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HistoryModal({ open, onClose }: HistoryModalProps) {
  const { transactions } = useCrypto();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Transaction history"
    >
      {transactions.length === 0 ? (
        <Empty description="No transactions yet" />
      ) : (
        <List
          dataSource={transactions}
          renderItem={(tx) => {
            const positive = tx.type === "buy";
            return (
              <List.Item>
                <Flex justify="space-between" style={{ width: "100%" }}>
                  <Flex align="center" gap={10}>
                    {tx.coinIcon && (
                      <img src={tx.coinIcon} alt={tx.coinName} width={24} />
                    )}
                    <Flex vertical>
                      <Typography.Text strong>{tx.coinName}</Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(tx.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                  <Flex vertical align="flex-end">
                    <Typography.Text
                      strong
                      style={{ color: positive ? "#3ecf8e" : "#e5484d" }}
                    >
                      {positive ? "Bought" : "Sold"} {tx.amount}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      at ${tx.price.toFixed(2)} · ${tx.total.toFixed(2)}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
}
