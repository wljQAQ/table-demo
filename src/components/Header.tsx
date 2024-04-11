import { HTMLAttributes, forwardRef } from "react";

export const Header = forwardRef((props: HTMLAttributes<HTMLTableSectionElement>, ref) => {
  return <thead ref={ref} className="select-none" {...props}></thead>;
});
