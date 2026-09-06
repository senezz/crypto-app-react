import { useState } from "react";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Modal, Typography } from "antd";
import { useCrypto } from "../context/crypto-context";
import { logout } from "../auth";

function GoogleAvatar({
  size,
  onClick,
}: {
  size: number;
  onClick?: () => void;
}) {
  const { user } = useCrypto();
  if (!user || typeof user === "boolean") return null;
  const initial = (user.displayName ?? user.email ?? "?")
    .charAt(0)
    .toUpperCase();

  console.log("[UserProfile] user.photoURL", user.photoURL);

  return (
    <Avatar
      size={size}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
      icon={user.photoURL ? undefined : <UserOutlined />}
      src={
        user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? "avatar"}
            referrerPolicy="no-referrer"
          />
        ) : undefined
      }
    >
      {!user.photoURL && initial}
    </Avatar>
  );
}

export function UserProfile() {
  const [open, setOpen] = useState(false);
  const { user, setUser } = useCrypto();
  if (!user || typeof user === "boolean") return null;

  return (
    <>
      <GoogleAvatar size={36} onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Profile"
      >
        <Flex vertical align="center" gap={4} style={{ padding: "8px 0 20px" }}>
          <GoogleAvatar size={64} />
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
