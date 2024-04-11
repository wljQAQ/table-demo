import { useState, useMemo } from 'react';

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
  type SortingStateProps
} from '@tanstack/react-table';
import { Head, Header, Body, Cell, Row } from '.';
import { Person, makeColumns, makeData } from '../makeData';

export const Table = () => {
  const columns = useMemo<ColumnDef<Person>[]>(() => makeColumns(22, Cell), []);

  const [data, _setData] = useState(() => makeData(10, columns));

  const table = useReactTable({
    data,
    columns,
    state: {},
    meta: {},
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  });

  const { rows } = table.getRowModel();
  console.log(rows);

  return (
    <table className="grid relative">
      <Header className="grid sticky top-0">
        {table.getHeaderGroups().map(headerGroup => {
          return (
            <Row key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map(header => {
                return <Head key={header.id} header={header} table={table}></Head>;
              })}
            </Row>
          );
        })}
      </Header>

      <Body className="grid relative will-change-transform h-200px">
        {rows.map(row => {
          return (
            <Row className="flex" key={row.id}>
              {row.getAllCells().map(cell => {
                return <Cell className="flex" key={cell.id} cell={cell} table={table}></Cell>;
              })}
            </Row>
          );
        })}
      </Body>
    </table>
  );
};
