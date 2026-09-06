import { Button, Card, Flex, Typography } from "antd";
import * as Auth from "../auth";
import { useCrypto } from "../context/crypto-context";
import type { CSSProperties } from "react";
import googleIcon from "../assets/google-logo-search-new-svgrepo-com.svg";

const { Title, Text } = Typography;

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
};

const cardStyle: CSSProperties = {
  width: 320,
};

export default function LoginPage() {
  const { setUser } = useCrypto();
  return (
    <Flex justify="center" align="center" style={pageStyle}>
      <Card style={cardStyle} styles={{ body: { padding: 24 } }}>
        <Flex vertical gap={4} style={{ marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>
            Crypto manager
          </Title>
          <Text type="secondary">Track your portfolio in one place.</Text>
        </Flex>
        <Button
          block
          onClick={() => Auth.login(setUser)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <img src={googleIcon} alt="" width={16} height={16} />
          Continue with Google
        </Button>
      </Card>
    </Flex>
  );
}
