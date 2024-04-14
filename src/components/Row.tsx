import { forwardRef } from 'react';

export const Row = forwardRef((props: React.HTMLAttributes<HTMLTableRowElement>, ref) => {
  return <tr ref={ref} className="hover:bg-header flex w-full border-b border-divider" {...props}></tr>;
});
