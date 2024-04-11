import { forwardRef } from "react";

export const Row = forwardRef((props: React.HTMLAttributes<HTMLTableRowElement>, ref) => {
  return (
    <tr ref={ref} className=" flex table-border border-b hover:bg-#2196f318 w-full" {...props}></tr>
  );
});
