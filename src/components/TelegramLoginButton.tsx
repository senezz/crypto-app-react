import { useState } from "react";
import { Button, Avatar } from "antd";
import TelegramCodeModal from "./TelegramCodeModal";
import * as Auth from "../auth";

export default function TelegramLoginButton() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    Auth.loginWithTelegram();
    setModalOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>
        Link Telegram{" "}
        <Avatar src="src/assets/telegram-svgrepo-com.svg" size={24} />
      </Button>
      <TelegramCodeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(code) => Auth.verifyTelegramCode(code)}
      />
    </>
  );
}
