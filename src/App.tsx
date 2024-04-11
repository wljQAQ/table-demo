import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

function App() {
  return (
    <>
      <ConfigProvider locale={zhCN}></ConfigProvider>
    </>
  );
}

export default App;
