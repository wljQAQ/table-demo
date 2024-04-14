import { HTMLAttributes } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export const Body = (props: HTMLAttributes<HTMLTableSectionElement>) => {

  
  return <tbody {...props}></tbody>;
};
