import { Layout, Spin } from "antd";
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import AppContent from "./AppContent";
import { useContext } from "react";
import CryptoContext from "../../context/crypto-context";
import LoginPage from "../LoginPage";

export default function AppLayout() {
  const { loading, login } = useContext(CryptoContext);

  if (loading) {
    return <Spin fullscreen />;
  }

  if (!login) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <AppHeader />
      <Layout>
        <AppSider />
        <AppContent />
      </Layout>
    </Layout>
  );
}
