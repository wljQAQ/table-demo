import { useState, type CSSProperties } from 'react';

import type { Cell as CellProps, Column as ColumnProps, Table as TableProps } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Person } from '../makeData';

import { Divider } from 'antd';

export const Cell = ({ cell }: { cell: CellProps<any, any> }) => {
  return <td className=" text-#4B4B4B hover:table-outline z-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
};
