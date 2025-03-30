"use client";

import * as React from "react";
import { ArrowUpCircle, CheckCircle2, Circle, HelpCircle, LucideIcon, Search, XCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
  id: string;
  icon?: LucideIcon;
  data?: any;
};
export const demoItems: Option[] = [];

export const demoOptions: Option[] = [
  {
    value: "משה לוי",

    label: "משה לוי",
    id: "4124",
    icon: HelpCircle,
  },
  {
    value: "איציק כהן",
    label: "איציק כהן",
    id: "4002",

    icon: Circle,
  },
  {
    value: "רמי נדלן",
    label: "רמי נדלן",
    id: "4332",
    icon: ArrowUpCircle,
  },
  {
    value: "סמי גרעינים",
    label: "סמי גרעינים",
    id: "6332",
    icon: ArrowUpCircle,
  },
  {
    value: "נופר ציפורניים",
    label: "נופר ציפורניים",
    id: "6033",
    icon: ArrowUpCircle,
  },
];

export function useComboboxPopover({
  buttonPlaceHolder,
  searchPlaceHolder,
  options,
  lable,
  defaultIcon,
  trigerComp,
  isMulti,
  cb,
}: {
  searchPlaceHolder: string;

  options: Option[] | null;
  defaultIcon?: Boolean;
  trigerComp?: React.ReactNode;
  buttonPlaceHolder?: string;
  lable?: string;
  isMulti?: boolean;
  cb?: (val: Option) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const cashedOptions = React.useMemo(() => {
    return !options ? null : options.map((opt) => ({ ...opt, query: JSON.stringify(opt) }));
  }, [options]);
  const [selectedOption, setSelectedOption] = React.useState<Option | null>(null);
  const [query, setQuery] = React.useState("");
  const ComboBOX = cashedOptions ? (
    <div dir={`rtl`} className="flex w-full justify-center items-center ">
      <p className="text-sm w-full text-muted-foreground opacity-60">{lable}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex min-w-full justify-center border-4 " asChild>
          {trigerComp ? (
            trigerComp
          ) : (
            <Button variant="outline" size="sm" className="w-[150px] gap-1 justify-start">
              {selectedOption ? (
                <>
                  {selectedOption.icon && <selectedOption.icon className="mr-2 h-4 w-4 shrink-0" />}
                  {selectedOption.label}
                </>
              ) : (
                <span className={`opacity-80`}>+ {buttonPlaceHolder}</span>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          // side="right"
          //  align="start"
        >
          <Command dir={`rtl`}>
            {isMulti ? (
              <div className={`flex w-full`}>
                <Button variant={"ghost"}>
                  <X onClick={() => setOpen(false)} />
                </Button>

                <CommandInput onValueChange={(value) => setQuery(value)} placeholder={searchPlaceHolder} />
              </div>
            ) : (
              <CommandInput placeholder={searchPlaceHolder} />
            )}
            <CommandList>
              <CommandEmpty>...אין תוצאות</CommandEmpty>
              <CommandGroup>
                {cashedOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.query}
                    onSelect={(value) => {
                      const selected = cashedOptions.find((priority) => priority.query === value) || null;
                      cb && selected && cb(selected);
                      setSelectedOption(selected);

                      !isMulti && setOpen(false);
                    }}
                  >
                    <div className={`flex w-full `}>
                      <p className="flex w-full gap-1">
                        {defaultIcon ? (
                          <Circle className={cn("mr-2 h-4 w-4", option.value === selectedOption?.value ? "opacity-100" : "opacity-40")} />
                        ) : (
                          option?.icon && (
                            <option.icon
                              className={cn("mr-2 h-4 w-4", option.value === selectedOption?.value ? "opacity-100" : "opacity-40")}
                            />
                          )
                        )}
                        <span>{option.label}</span>
                      </p>
                      <p className={`w-1/2   ${option.value === selectedOption?.value ? "opacity-100" : "opacity-40"}`}>
                        <span>{option.id}</span>
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  ) : null;
  return [ComboBOX, selectedOption, setSelectedOption, query, setQuery] as const;
}

// const [cb,s,ss] = useComboboxPopover()
