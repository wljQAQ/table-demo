import { faker } from '@faker-js/faker';
import { filterFns } from '@tanstack/react-table';

export const makeColumns = (num: number, Cell: any) =>
  [...Array(num)].map((_, i) => {
    return {
      id: i.toString(),
      accessorKey: i.toString(),
      header: 'Column ' + i.toString(),
      size: Math.floor(Math.random() * 150) + 100,
      // filterFn: 'equalsString'
      // cell: Cell,
    };
  });

export const makeData = (num: number, columns) =>
  [...Array(num)].map(() => ({
    ...Object.fromEntries(columns.map(col => [col.accessorKey, faker.person.firstName()]))
  }));

export type Person = ReturnType<typeof makeData>[0];
