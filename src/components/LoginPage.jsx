import { Button, Layout, Space, Avatar } from "antd";
import * as Auth from "../auth";
import { useCrypto } from "../context/crypto-context";

const { Content } = Layout;

export default function LoginPage() {
  const { setUser } = useCrypto();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Button block onClick={() => Auth.login(setUser)}>
            Sign in with Google{" "}
            <Avatar
              src="src/assets/google-logo-search-new-svgrepo-com.svg"
              size={24}
            />
          </Button>
          <Button block onClick={() => Auth.loginWithTelegram()}>
            Sign in with Telegram
            {<Avatar src="src/assets/telegram-svgrepo-com.svg" size={24} />}
          </Button>
        </Space>
      </Content>
    </Layout>
  );
}
