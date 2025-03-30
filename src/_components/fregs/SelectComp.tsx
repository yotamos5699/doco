"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { HTMLAttributes, useEffect, useState } from "react";
import { Opt } from "../ItemSelection";

export type SelectOption = { label: string; value: string | number };

const Style_ = {
  xs: { triger: "w-24", content: "" },
  s: { triger: "w-32 ", content: "" },
  m: { triger: "", content: "" },
  l: { triger: "", content: "" },
  default: { triger: "w-[180px]", content: "" },
} as const;

export const SelectComp = ({
  options,
  cb,
  notSelectable,

  title,
  initialValue,
  size,
}: {
  options: Opt[];
  cb: (val: Opt) => void;
  notSelectable?: boolean;
  title?: string;
  initialValue?: string | number;
  size?: keyof typeof Style_;
}) => {
  const [selected, setSelected] = useState<string | number>(() => initialValue ?? "");

  useEffect(() => {
    console.log({ selected });
  }, [selected]);
  return (
    <Select
      dir="rtl"
      value={selected.toString()}
      onValueChange={(value) => {
        const option = options.filter((opt) => opt.id === Number(value))[0];
        console.log({ notSelectable });
        setSelected(notSelectable ? "" : option.id);
        cb(option);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent className="w-full">
        {options.map((opt) => (
          <SelectItem key={opt.id} value={opt.id.toString()}>
            {opt.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
