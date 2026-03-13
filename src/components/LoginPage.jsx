import { Button, Layout, Space, Avatar, Typography, Modal } from "antd";
import * as Auth from "../auth";
import { useCrypto } from "../context/crypto-context";

const { Title, Text } = Typography;
const backdropStyle = {
  position: "fixed",
  inset: 0,
  background:
    "radial-gradient(ellipse at 30% 40%, #003a6b 0%, #001529 50%, #000d1a 100%)",
  zIndex: 0,
};

const modalStyles = {
  mask: { background: "transparent" },
  content: {
    background: "#001f3f",
    border: "1px solid rgba(64, 150, 255, 0.2)",
    boxShadow: "0 8px 48px rgba(0, 0, 0, 0.6)",
  },
};

export default function LoginPage() {
  const { setUser } = useCrypto();
  return (
    <>
      <div style={backdropStyle} />
      <Modal
        open
        centered
        footer={null}
        closable={false}
        getContainer={false}
        styles={modalStyles}
      >
        <Space
          orientation="vertical"
          align="center"
          style={{ width: "100%", padding: "16px 0" }}
        >
          <Title level={3} style={{ margin: 0, color: "#4096ff" }}>
            Welcome to Crypto Portfolio
          </Title>
          <Text type="secondary">Sign in to track your assets</Text>
          <Button
            block
            onClick={() => Auth.login(setUser)}
            style={{ marginTop: 16 }}
          >
            Sign in with Google{" "}
            <Avatar
              src="src/assets/google-logo-search-new-svgrepo-com.svg"
              size={20}
            />
          </Button>
        </Space>
      </Modal>
    </>
  );
}
