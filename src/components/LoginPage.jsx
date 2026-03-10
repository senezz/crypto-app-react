import { Button, Layout } from "antd";
import * as Auth from "../auth";

export default function LoginPage() {
  return (
    <Layout
      style={{
        width: "100vw",
        height: "100vh",
        top: "0px",
        left: "0px",
        position: "absolute",
      }}
    >
      <Button onClick={() => Auth.login()}>Login</Button>
    </Layout>
  );
}
