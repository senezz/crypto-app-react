import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Space, Typography, Flex, Popover, Button } from "antd";
import { useCrypto } from "../context/crypto-context";
import { logout } from "../auth";

export function UserProfile() {
  const { user, setUser } = useCrypto();
  const popoverContent = (
    <Button
      type="text"
      danger
      icon={<LogoutOutlined />}
      onClick={() => logout(setUser)}
      style={{ width: "100%" }}
    >
      Logout
    </Button>
  );

  return (
    <Space size={12}>
      <Popover content={popoverContent} trigger="click" placement="bottomRight">
        <Avatar
          size={36}
          src={user.photoURL}
          icon={<UserOutlined />}
          style={{ cursor: "pointer" }}
        />
      </Popover>
      <Flex vertical>
        <Typography.Text style={{ color: "#ffffff" }}>
          {user.displayName ?? "Username"}
        </Typography.Text>
        <Typography.Text style={{ color: "#ffffff" }}>
          {user.email ?? "Email"}
        </Typography.Text>
      </Flex>
    </Space>
  );
}
