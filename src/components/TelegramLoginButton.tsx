import { useState, useEffect } from "react";
import { Button, Avatar, message } from "antd";
import TelegramCodeModal from "./TelegramCodeModal";
import * as Auth from "../auth";
import { getTelegramUsername, saveTelegramUsername } from "../firebase";
import { useCrypto } from "../context/crypto-context";
import telegramIcon from "../assets/telegram-svgrepo-com.svg";

type VerifiedUser = { username: string; userId: number };

export default function TelegramLoginButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [linkedUsername, setLinkedUsername] = useState<string | null>(null);
  const { user } = useCrypto();

  useEffect(() => {
    if (user && typeof user !== "boolean") {
      getTelegramUsername(user.uid).then((username) => {
        if (username) setLinkedUsername(username);
      });
    } else {
      setLinkedUsername(null);
    }
  }, [user]);

  const handleClick = () => {
    Auth.loginWithTelegram();
    setModalOpen(true);
  };

  const handleConfirm = (verifiedUser: VerifiedUser) => {
    setLinkedUsername(verifiedUser.username);
    if (user && typeof user !== "boolean") {
      saveTelegramUsername(
        user.uid,
        verifiedUser.username,
        verifiedUser.userId,
      );
    }
    message.success(`Telegram @${verifiedUser.username} linked successfully!`);
  };

  const handleReject = () => {
    message.info("Telegram linking cancelled.");
  };

  return (
    <>
      <Button onClick={handleClick}>
        {linkedUsername ? `@${linkedUsername}` : "Link Telegram"}{" "}
        <Avatar src={telegramIcon} size={24} />
      </Button>
      <TelegramCodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onVerify={(code) => Auth.verifyTelegramCode(code)}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    </>
  );
}
