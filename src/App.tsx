import { ConfigProvider, theme as antdTheme } from "antd";
import AppLayout from "./components/layout/AppLayout";
import { CryptoContextProvider } from "./context/crypto-context";
import theme from "./theme";

export default function App() {
  return (
    <ConfigProvider theme={{ algorithm: antdTheme.darkAlgorithm, ...theme }}>
      <CryptoContextProvider>
        <AppLayout />
      </CryptoContextProvider>
    </ConfigProvider>
  );
}
