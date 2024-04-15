import { HTMLAttributes, forwardRef } from 'react';

interface Props extends HTMLAttributes<HTMLTableSectionElement> {}

export const Header = forwardRef<HTMLTableSectionElement, Props>((props, ref) => {
  return <thead ref={ref} className="select-none" {...props}></thead>;
});
