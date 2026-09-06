import { useState } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Modal, Typography } from "antd";
import { useCrypto } from "../context/crypto-context";
import { logout } from "../auth";

export function UserProfile() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useCrypto();
  if (!user || typeof user === "boolean") return null;
  const initial = (user.displayName ?? user.email ?? "?")
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <Avatar
        size={36}
        src={user.photoURL}
        icon={user.photoURL ? undefined : <UserOutlined />}
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      >
        {!user.photoURL && initial}
      </Avatar>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Profile"
      >
        <Flex vertical align="center" gap={4} style={{ padding: "8px 0 20px" }}>
          <Avatar
            size={64}
            src={user.photoURL}
            icon={user.photoURL ? undefined : <UserOutlined />}
          >
            {!user.photoURL && initial}
          </Avatar>
          <Typography.Text strong style={{ fontSize: 16, marginTop: 8 }}>
            {user.displayName ?? "Username"}
          </Typography.Text>
          <Typography.Text type="secondary">
            {user.email ?? "Email"}
          </Typography.Text>
        </Flex>
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={() => logout(setUser)}
        >
          Log out
        </Button>
      </Modal>
    </>
  );
}
