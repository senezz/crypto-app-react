import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Typography, Flex } from "antd";
import { useCrypto } from "../context/crypto-context";

export function UserProfile() {
  const { user } = useCrypto();
  return (
    <div>
      <Space wrap size={16}>
        <Avatar size={36} src={user.photoURL} icon={<UserOutlined />} />
        <Flex vertical>
          <Typography.Text style={{ color: "#ffffff" }}>
            {user.displayName ?? "Username"}
          </Typography.Text>
          <Typography.Text style={{ color: "#ffffff" }}>
            {user.email ?? "Email"}
          </Typography.Text>
        </Flex>
      </Space>
    </div>
  );
}
