import type { Table } from '@tanstack/react-table';

import { useVirtualizer } from '@tanstack/react-virtual';
import { RefObject } from 'react';

interface VirtualOption {
  table: Table<Record<string, any>>;
  container: RefObject<HTMLElement>;
}

export function useTableVirtualizer({ table, container }: VirtualOption) {
  const { rows } = table.getRowModel();

  const visibleColumns = table.getVisibleLeafColumns();

  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: index => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => container.current,
    horizontal: true,
    overscan: 3 //how many columns to render on each side off screen each way (adjust this for performance)
  });

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 37, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => container.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement: element => element?.getBoundingClientRect().height,
    overscan: 5
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();
  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;
  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return {
    rowVirtualizer,
    virtualColumns,
    virtualRows,
    virtualPaddingLeft,
    virtualPaddingRight,
    columnVirtualizer
  };
}
