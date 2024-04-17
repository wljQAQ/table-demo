import { ConfigProvider, Layout, Select, Button, Popover, Space, Form, Radio, theme as antdTheme, Switch, Input } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Table } from './components';
import { makeColumns, makeData, Person } from './makeData';
import { memo, useMemo, useState, Dispatch, SetStateAction } from 'react';
import { ColumnDef, ColumnFiltersState } from '@tanstack/react-table';
import { SizeState } from './components/features/size';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash-es';

const { Header, Content } = Layout;

const Text_Filter = [
  { value: 'includesStringSensitive', label: '包含' },
  { value: 'unIncludesStringSensitive', label: '不包含' },
  { value: 'startsWith', label: '开始于' },
  { value: 'endsWith', label: '结束与' },
  { value: 'null', label: '空' },
  { value: 'notNull', label: '不为空' },
  { value: 'weakEquals', label: '=' },
  { value: 'unWeakEquals', label: '!=' }
];

const Num_Filter = [
  { value: 'weakEquals', label: '==' },
  { value: 'unWeakEquals', label: '!=' },
  { value: 'greaterThan', label: '>' },
  { value: 'lessThan', label: '<' },
  { value: 'greaterThanOrEqual', label: '>=' },
  { value: 'lessThanOrEqual', label: '<=' },
  { value: 'null', label: '空' },
  { value: 'notNull', label: '不为空' },
  { value: 'inNumberRange', label: '介于' }
];

interface FilterProps {
  columns: ColumnDef<Person>[];
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const FiltersForm = memo(({ columns, setColumnFilters }: FilterProps) => {
  const [form] = Form.useForm();

  const colOptions = useMemo(() => {
    return columns.map(i => {
      return {
        value: i.id,
        label: i.header
      };
    });
  }, [columns, form]);

  function onFilterChange(values, allValues) {
    // console.log('Received values of form:', ...arguments, form);
    console.log(allValues, columns);
    setColumnFilters(allValues.filters.map(i => ({ id: i.id, value: i.value })));
  }
  console.log(111);

  return (
    <>
      <Form
        form={form}
        className="px-4"
        name="filters"
        onValuesChange={debounce(onFilterChange, 300)}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.List name="filters">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} className="flex" align="baseline">
                  <span className="pr-3">且</span>

                  <Form.Item {...restField} name={[name, 'id']} rules={[{ required: true, message: 'Missing first name' }]}>
                    <Select style={{ width: '120px' }} placeholder="列名称" options={colOptions} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'filterFn']} rules={[{ required: true, message: 'Missing last name' }]}>
                    <Select style={{ width: '140px' }} placeholder="筛选方法" options={Text_Filter} />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: 'Missing last name' }]}>
                    {/* <Select style={{ width: '170px' }} showSearch placeholder="请输入值" /> */}
                    <Input placeholder="请输入值" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button onClick={() => add({ id: '1', filterFn: Text_Filter[0].value })} block icon={<PlusOutlined />}>
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

  console.log('app render', filter);

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
                <Popover
                  title="列筛选"
                  placement="bottomLeft"
                  trigger="click"
                  content={<FiltersForm columns={columns} setColumnFilters={setColumnFilters} />}
                >
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
