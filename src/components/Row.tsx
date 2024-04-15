import { forwardRef, ReactNode } from 'react';

type RowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  children?: ReactNode;
};

export const Row = forwardRef<HTMLTableRowElement, RowProps>((props, ref) => {
  return <tr ref={ref} className="flex w-full border-b border-divider hover:bg-header" {...props}></tr>;
});
