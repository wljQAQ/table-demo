import { useState } from 'react';

import { KeyboardSensor, MouseSensor, TouchSensor, type DragEndEvent, useSensor, useSensors } from '@dnd-kit/core';

import { arrayMove } from '@dnd-kit/sortable';

import { ColumnDef } from '@tanstack/react-table';

export function useTableDnD<T>(columns: ColumnDef<T>[]) {
  const [columnOrder, setColumnOrder] = useState(() => columns.map(c => c.id!));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor, {})
  );

  return { columnOrder, setColumnOrder, handleDragEnd, sensors };
}
