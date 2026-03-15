import { Button, Avatar } from "antd";
import * as Auth from "../auth";

export default function TelegramLoginButton() {
  return (
    <Button onClick={() => Auth.loginWithTelegram()}>
      Link Telegram{" "}
      <Avatar src="src/assets/telegram-svgrepo-com.svg" size={24} />
    </Button>
  );
}
