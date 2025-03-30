// import React from 'react'

import { HTMLAttributes } from "react";

export const SelectCastum = ({
  selected,
  options,
  title,
  ...props
}: { selected: string | number; options: string[] | number[]; title?: string } & HTMLAttributes<HTMLSelectElement>) => {
  console.log({ selected });
  return (
    <select {...props} id="foodSelect" value={selected}>
      {options.map((pos) => (
        <option key={pos} value={pos}>
          {pos}
        </option>
      ))}
    </select>
  );
};

export const SelectObject = ({
  selected,
  options,
  title,
  ...props
}: {
  selected: string | number;
  options: { id: string; value?: any; title: string }[];
  title?: string;
} & HTMLAttributes<HTMLSelectElement>) => {
  console.log({ selected });
  return (
    <select
      {...props}
      // id="foodSelect"
      value={title ?? selected}
    >
      {options.map((pos) => (
        <option value={pos.id}>{pos.title}</option>
      ))}
    </select>
  );
};
