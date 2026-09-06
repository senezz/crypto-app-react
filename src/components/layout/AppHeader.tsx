import { Layout, Select, Space, Button, Modal } from "antd";
import { useCrypto } from "../../context/crypto-context";
import { useEffect, useState } from "react";
import CoinInfoModal from "../CoinInfoModal";
import AddAssetForm from "../AddAssetForm";
import { UserProfile } from "../UserProfile";
import TelegramLoginButton from "../TelegramLoginButton";
import { Coin } from "../../types/types";

const headerStyle: React.CSSProperties = {
  width: "100%",
  height: 60,
  padding: "0 1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #2a2a2a",
};

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [coin, setCoin] = useState<Coin | null>(null);
  const [modal, setModal] = useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState(false);
  const { crypto } = useCrypto();

  useEffect(() => {
    const keypress = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setSelect((prev) => !prev);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handleSelect(value: string): void {
    setCoin(crypto.find((c) => c.id === value) ?? null);
    setModal(true);
  }

  return (
    <Layout.Header style={headerStyle}>
      <Select
        style={{
          width: 250,
        }}
        open={select}
        onSelect={handleSelect}
        onClick={() => setSelect((prev) => !prev)}
        value="press / to open"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />{" "}
            {option.data.label}
          </Space>
        )}
      />

      <Space size={12} align="center">
        <Button type="primary" onClick={() => setAddAssetOpen(true)}>
          Add Asset
        </Button>

        <TelegramLoginButton />

        <UserProfile />
      </Space>

      <Modal open={modal} onCancel={() => setModal(false)} footer={null}>
        <CoinInfoModal coin={coin} />
      </Modal>

      <Modal
        title="Add asset"
        onCancel={() => setAddAssetOpen(false)}
        open={addAssetOpen}
        footer={null}
        destroyOnHidden
      >
        <AddAssetForm onClose={() => setAddAssetOpen(false)} />
      </Modal>
    </Layout.Header>
  );
}
