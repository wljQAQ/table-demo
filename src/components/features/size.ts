import { makeStateUpdater, TableFeature, Table, RowData, OnChangeFn, Updater, functionalUpdate } from '@tanstack/react-table';

export type SizeState = 'small' | 'middle' | 'large';
export interface SizeTableState {
  size: SizeState;
}

export interface SizeOptions {
  enableSize?: boolean;
  onSizeChange?: OnChangeFn<SizeState>;
}

export interface SizeInstance {
  setSize: (updater: Updater<SizeState>) => void;
  toggleSize: (value?: SizeState) => void;
}

export const SizeFeature: TableFeature<any> = {
  getInitialState: (state): SizeTableState => {
    return {
      size: 'middle',
      ...state
    };
  },

  getDefaultOptions: <TData extends RowData>(table: Table<TData>): SizeOptions => {
    return {
      enableSize: true,
      onSizeChange: makeStateUpdater('size', table)
    } as SizeOptions;
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setSize = updater => {
      const safeUpdater: Updater<SizeState> = old => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onSizeChange?.(safeUpdater);
    };
    table.toggleSize = value => {
      table.setSize(old => {
        if (value) return value;
        return old === 'large' ? 'middle' : old === 'middle' ? 'small' : 'large'; //cycle through the 3 options
      });
    };
  }
};

declare module '@tanstack/react-table' {
  interface TableState extends SizeTableState {}
  interface TableOptionsResolved<TData extends RowData> extends SizeOptions {}
  interface Table<TData extends RowData> extends SizeInstance {}
}
