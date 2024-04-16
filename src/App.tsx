import { ConfigProvider, Layout, Select, Button, Popover, Space, Form, Radio, theme as antdTheme, Switch, Input } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Table } from './components';
import { makeColumns, makeData, Person } from './makeData';
import { memo, useMemo, useState } from 'react';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { SizeState } from './components/features/size';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash-es';

const { Header, Content } = Layout;

const FiltersForm = memo(() => {
  const [form] = Form.useForm();
  function onFinish(values) {
    console.log('Received values of form:', ...arguments);
  }
  console.log(111);

  return (
    <>
      <Form
        className="px-4"
        name="dynamic_form_nest_item"
        onValuesChange={debounce(onFinish, 300)}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.List name="filters">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="flex" align="baseline">
                  <span className="pr-3">且</span>

                  <Form.Item {...restField} name={[name, 'first']} rules={[{ required: true, message: 'Missing first name' }]}>
                    <Select placeholder="列名称" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'last']} rules={[{ required: true, message: 'Missing last name' }]}>
                    <Select placeholder="筛选方法" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'last']} rules={[{ required: true, message: 'Missing last name' }]}>
                    <Input placeholder="请输入值" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button onClick={() => add()} block icon={<PlusOutlined />}>
                  添加过滤器
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </>
  );
});

function App() {
  const columns = useMemo<ColumnDef<Person>[]>(() => makeColumns(22, null), []);
  const [data, setData] = useState(makeData(1_000, columns));
  const [size, setSize] = useState<SizeState>('middle');
  const [theme, setTheme] = useState('light');

  const [filter, setFilter] = useState('');

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
          <Header className="bg-containHeader shadow-sm">
            <Switch checkedChildren="light" unCheckedChildren="dark" defaultChecked onChange={onChangeTheme} />
          </Header>
          <Content className="p-6">
            <div className="flex h-full flex-col rounded-lg bg-containHeader p-4">
              <Space className="pb-4">
                <Input value={filter} onChange={e => setFilter(e.target.value)} />
                <Popover title="列筛选" placement="bottomLeft" trigger="click" content={<FiltersForm />}>
                  <Button>筛选</Button>
                </Popover>
                <Button>排序</Button>
                <Radio.Group defaultValue="middle" onChange={e => setSize(e.target.value)}>
                  <Radio.Button value="large">Large</Radio.Button>
                  <Radio.Button value="middle">Default</Radio.Button>
                  <Radio.Button value="small">Small</Radio.Button>
                </Radio.Group>
              </Space>
              <Table columns={columns} data={data} size={size} globalFilter={filter} columnFilters={columnFilters}></Table>
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}

export default App;
