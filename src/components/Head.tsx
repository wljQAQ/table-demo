import { useState, memo, type CSSProperties } from 'react';

import type { Header as HeaderProps, Column as ColumnProps, Table as TableProps } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Person } from '../makeData';

import { Divider } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

export const Head = ({ header }: { header: HeaderProps<Person, unknown> }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.id
  });

  const { getState } = header.getContext().table;

  const { size } = getState();

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    whiteSpace: 'nowrap',
    width: header.getSize(),
    zIndex: isDragging ? 1 : 0
  };

  function handleResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    header.getResizeHandler()(e);
  }
  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    header.column.getToggleSortingHandler()?.(e);
  }

  return (
    <th
      ref={setNodeRef}
      className={`p-${size} relative flex cursor-pointer select-none flex-wrap items-center border-b border-divider bg-containHeader p-4 text-left font-semibold`}
      style={style}
      colSpan={header.colSpan}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

      {/* 排序图标 */}
      <span className="pl-3 text-xs font-normal">
        {{
          asc: <UpOutlined />,
          desc: <DownOutlined />
        }[header.column.getIsSorted() as string] ?? null}
      </span>
      {/* {header.column.getCanFilter() ? (
        <div className="w-full" onClick={e => e.stopPropagation()}>
          <Filter column={header.column} table={table} />
        </div>
      ) : null} */}
      <div
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 cursor-ew-resize p-2"
        onMouseDown={handleResize}
        onClick={e => e.stopPropagation()}
      >
        <Divider type="vertical" />
      </div>
    </th>
  );
};

const SortIcon = memo(() => {
  return <span>Head</span>;
});

export default Head;
