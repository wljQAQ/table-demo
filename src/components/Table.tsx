import { useState, useMemo, useRef } from 'react';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
  FilterFn,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  sortingFns,
  type ColumnFiltersState,
  type Header as HeaderProps,
  type Row as RowProps,
  type SortingState,
  TableMeta,
  RowData
} from '@tanstack/react-table';

import { DndContext, closestCenter } from '@dnd-kit/core';

import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { Head, Header, Body, Cell, Row } from '.';
import { Person, makeColumns, makeData } from '../makeData';
import { SizeFeature, SizeState } from './features/size';

import { useTableVirtualizer } from '../hooks/useTableVirtualizer';
import { useTableDnD } from '../hooks/useTableDnD';
import CellsRange from './CellsRange';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    cellEditing: string;
    setCellEditing: (cellId: string) => void;
  }
}

interface TableProps {
  columns: ColumnDef<Person>[];
  data: Person[];
  size: SizeState;
}

export const Table = ({ columns, data: DefaultData, size }: TableProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  // const columns = useMemo<ColumnDef<Person>[]>(() => makeColumns(22, Cell), []);
  // const columns = useMemo<ColumnDef<Person>[]>(() => DefaultCol || [], []);
  // const [data, setData] = useState(() => makeData(1_000, columns));
  const [data, setData] = useState(DefaultData || []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const [cellsRange, setCellsRange] = useState<Map<string, any>>(new Map());
  // const [size, setSize] = useState<SizeState>(DefaultSize);
  const [cellEditing, setCellEditing] = useState('');

  //列排序
  const { columnOrder, setColumnOrder, handleDragEnd, sensors } = useTableDnD(columns);

  const table = useReactTable({
    _features: [SizeFeature],
    data,
    columns,
    columnResizeMode: 'onChange',
    state: {
      columnOrder,
      sorting,
      columnFilters,
      globalFilter,
      size
      // pagination
    },
    meta: {
      // cellsRange,
      // setCellsRange,
      cellEditing,
      setCellEditing,
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              };
            }
            return row;
          })
        );
      }
    },
    // onSizeChange: setSize,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnOrderChange: setColumnOrder,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  });

  const { rows } = table.getRowModel();

  //虚拟化
  const { virtualColumns, rowVirtualizer, virtualRows, virtualPaddingLeft, virtualPaddingRight } = useTableVirtualizer({
    table,
    container: tableContainerRef
  });

  return (
    <DndContext collisionDetection={closestCenter} modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
      <div ref={tableContainerRef} className="table-box relative h-full overflow-auto">
        <table className="relative grid " style={{ transition: 'padding 0.2s ease 0s' }}>
          <Header className="sticky top-0 z-10 grid">
            {table.getHeaderGroups().map(headerGroup => (
              <Row className="flex w-full" key={headerGroup.id}>
                {virtualPaddingLeft ? <th style={{ display: 'flex', width: virtualPaddingLeft }} /> : null}

                <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                  {virtualColumns.map(vc => {
                    const header = headerGroup.headers[vc.index];
                    return <Head key={header.id} header={header} />;
                  })}
                </SortableContext>

                {virtualPaddingRight ? <th style={{ display: 'flex', width: virtualPaddingRight }} /> : null}
              </Row>
            ))}
          </Header>

          <Body className="relative grid will-change-transform" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as RowProps<Person>;
              const visibleCells = row.getVisibleCells();
              return (
                <Row
                  data-index={virtualRow.index}
                  ref={node => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  style={{
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                >
                  {virtualPaddingLeft ? <td style={{ display: 'flex', width: virtualPaddingLeft }} /> : null}

                  {virtualColumns.map(vc => {
                    const cell = visibleCells[vc.index];
                    return <Cell data-table={`cell-${cell.id}`} key={cell.id} cell={cell} />;
                  })}

                  {virtualPaddingRight ? <td style={{ display: 'flex', width: virtualPaddingRight }} /> : null}
                </Row>
              );
            })}

            {/* <CellsRange cellsRange={cellsRange}></CellsRange> */}
          </Body>
        </table>
      </div>
    </DndContext>
  );
};
