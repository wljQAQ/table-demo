import { useState, type CSSProperties, useRef, memo } from 'react';

import type { Cell as CellProps, Column as ColumnProps, Table as TableProps } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { Person } from '../makeData';

import { Input } from 'antd';

interface Props {
  cell: CellProps<Person, string>;
}

export const Cell = ({ cell }: Props) => {
  const { options, getState } = cell.getContext().table;

  const { meta } = options;
  const { size } = getState();
  const handleDblClick = () => {
    console.log('dblclick', cell, getState());
    meta?.setCellEditing(cell.id);
  };

  return (
    <td
      className={`relative select-none border-divider p-${size}`}
      style={{ width: cell.column.getSize() }}
      onDoubleClick={handleDblClick}
    >
      {cell.id === meta!.cellEditing ? <EditCell cell={cell} /> : flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

function EditCell({ cell }: Props) {
  const { meta } = cell.getContext().table.options;
  const [value, setValue] = useState(cell.getValue());

  function onBlur() {
    meta?.setCellEditing('');
    meta?.updateData(cell.row.index, cell.column.id, value);
  }

  return (
    <>
      <div className="absolute left-0 top-0 h-full w-full flex-center">
        <Input value={value} onChange={e => setValue(e.target.value)} onBlur={onBlur} autoFocus />
      </div>
    </>
  );
}

// const CellEditor = memo((props: CellContext<Person, unknown>) => {
//   const { getValue, row, column, table, cell } = props;
//   const initialValue = getValue();
//   // We need to keep and update the state of the cell normally
//   const [value, setValue] = useState(initialValue);
//   const [isEditing, setIsEditing] = useState(false);
//   // console.log('重新渲染', table.options.meta);
//   // When the input is blurred, we'll call our table meta's updateData function
//   const onBlur = () => {
//     // table.options.meta?.updateData(index, id, value);
//   };

//   const toggleEditing = () => {
//     setIsEditing(edit => !edit); // 切换编辑状态
//   };
//   // If the initialValue is changed external, sync it up with our state
//   // useEffect(() => {
//   //   setValue(initialValue);
//   // }, [initialValue]);
//   return isEditing ? (
//     // <div className="bg-red">{value}</div>
//     <input
//       className="h-37px border-rounded-0 focus:table-outline inline-block w-full border-none px-2"
//       defaultValue={value as string}
//       onBlur={toggleEditing} // 比如你可以在输入框失焦时保存并退出编辑模式
//       autoFocus
//     />
//   ) : (
//     // <span>111</span>
//     <div className="p-2" onClick={toggleEditing}>
//       {value}
//     </div>
//   );
// });
