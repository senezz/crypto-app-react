import { Layout, Spin } from "antd";
import AppHeader from "./AppHeader";
import AppContent from "./AppContent";
import { useContext } from "react";
import CryptoContext from "../../context/crypto-context";
import LoginPage from "../LoginPage";

export default function AppLayout() {
  const { loading, user } = useContext(CryptoContext);

  if (loading || user === false) {
    return <Spin fullscreen />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <AppHeader />
      <AppContent />
    </Layout>
  );
}
