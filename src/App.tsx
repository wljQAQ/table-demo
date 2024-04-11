import { ConfigProvider, Layout } from "antd";
import zhCN from "antd/locale/zh_CN";
const { Header, Content } = Layout;
import { Table } from "./components";

function App() {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <Layout className="w-full h-full">
          <Header>111</Header>
          <Content>
            <Table></Table>
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
