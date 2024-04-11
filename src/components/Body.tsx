import { HTMLAttributes } from "react";

export const Body = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody {...props}></tbody>;
};
