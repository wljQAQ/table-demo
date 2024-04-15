import { ConfigProvider, Layout, Button, Space, Radio, theme as antdTheme, Switch } from 'antd';
import zhCN from 'antd/locale/zh_CN';
const { Header, Content } = Layout;
import { Table } from './components';
import { makeColumns, makeData, Person } from './makeData';
import { useMemo, useState } from 'react';

import { ColumnDef } from '@tanstack/react-table';
import { SizeState } from './components/features/size';

function App() {
  const columns = useMemo<ColumnDef<Person>[]>(() => makeColumns(22, null), []);
  const [data, setData] = useState(makeData(1_000, columns));
  const [size, setSize] = useState<SizeState>('middle');
  const [theme, setTheme] = useState('light');

  console.log('app render');

  const themeObj = useMemo(() => {
    return {
      antd: theme === 'light' ? antdTheme.defaultAlgorithm : antdTheme.darkAlgorithm
    };
  }, [theme]);

  function onChangeTheme(e) {
    if (e) {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }
  return (
    <>
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm: themeObj.antd
        }}
      >
        <Layout className="h-full w-full">
          <Header className=" bg-white shadow-sm">
            <Switch checkedChildren="light" unCheckedChildren="dark" defaultChecked onChange={onChangeTheme} />
          </Header>
          <Content className="p-6">
            <div className="flex h-full flex-col rounded-lg bg-white p-4">
              <Space className="pb-4">
                <Button>筛选</Button>
                <Button>排序</Button>
                <Radio.Group defaultValue="middle" onChange={e => setSize(e.target.value)}>
                  <Radio.Button value="large">Large</Radio.Button>
                  <Radio.Button value="middle">Default</Radio.Button>
                  <Radio.Button value="small">Small</Radio.Button>
                </Radio.Group>
              </Space>
              <Table columns={columns} data={data} size={size}></Table>
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
