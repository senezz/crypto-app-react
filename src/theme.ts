import type { ThemeConfig } from "antd";

// Flat, dark, low-shadow theme matching the new mockups.
// Borders replace shadows for separating surfaces; green/red stay reserved
// for profit/loss signaling only.
const theme: ThemeConfig = {
  token: {
    colorPrimary: "#f5f5f0",
    colorBgBase: "#141414",
    colorTextBase: "#f5f5f0",
    colorBgContainer: "#1c1c1c",
    colorBgElevated: "#1c1c1c",
    colorBgLayout: "#141414",
    colorBorder: "#333333",
    colorBorderSecondary: "#2a2a2a",
    colorSuccess: "#3ecf8e",
    colorError: "#e5484d",
    borderRadius: 12,
    borderRadiusLG: 12,
    borderRadiusSM: 8,
    fontSize: 14,
    boxShadow: "none",
    boxShadowSecondary: "none",
    boxShadowTertiary: "none",
    motionDurationMid: "0.2s",
    motionDurationSlow: "0.25s",
  },
  components: {
    Card: {
      boxShadow: "none",
      boxShadowTertiary: "none",
      colorBorderSecondary: "#2a2a2a",
    },
    Button: {
      boxShadow: "none",
      primaryShadow: "none",
      dangerShadow: "none",
      defaultShadow: "none",
      borderRadius: 8,
    },
    Modal: {
      boxShadow: "none",
      contentBg: "#1c1c1c",
      headerBg: "#1c1c1c",
      borderRadiusLG: 16,
    },
    Input: {
      borderRadius: 8,
      activeShadow: "none",
      errorActiveShadow: "none",
      warningActiveShadow: "none",
    },
    Select: {
      borderRadius: 8,
    },
    Layout: {
      bodyBg: "#141414",
      headerBg: "#141414",
      siderBg: "#141414",
    },
  },
};

export default theme;
