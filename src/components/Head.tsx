import { useState, type CSSProperties } from "react";

import type {
  Header as HeaderProps,
  Column as ColumnProps,
  Table as TableProps,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Person } from "../makeData";

import { Divider } from "antd";

export const Head = ({
  header,
  table,
}: {
  header: HeaderProps<Person, unknown>;
  table: TableProps<any>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.3s ease-in-out",
    whiteSpace: "nowrap",
    width: header.getSize(),
    zIndex: isDragging ? 1 : 0,
  };
  const test = header.getResizeHandler();
  const sort = header.column.getToggleSortingHandler();
  function handleResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    test(e);
  }
  console.log(listeners, attributes);
  function handleClick(e) {
    console.log(sort);
    sort(e);
  }

  return (
    <th
      ref={setNodeRef}
      className="relative flex flex-wrap select-none  cursor-pointer items-center text-left px-2 font-500 text-#71717A h-10 bg-#F5F5F5"
      style={style}
      colSpan={header.colSpan}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: " 🔼",
        desc: " 🔽",
      }[header.column.getIsSorted() as string] ?? null}
      {/* {header.column.getCanFilter() ? (
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          <Filter column={header.column} table={table} />
        </div>
      ) : null} */}
      <Divider
        onMouseDown={handleResize}
        className="absolute right-0px top-50% translate-y--50% z-4 border-2 border-#D9D9DB cursor-ew-resize"
        type="vertical"
      />
    </th>
  );
};
