import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
// import { useClickOutSide } from "@/_hooks/useClickOutSide";

// export type Opt = {
//   value: string | number;
//   label: string;
// };

export type Opt = { name: string; id: number } & object;
// export type OptMult = {
//   value: number;
//   label: string;
// };
export function ItemSelectionSingle({
  options,
  cb,
  addNewRow,
  initialValue,
  title = "בחר",
}: {
  options: Opt[];
  cb?: (val: number) => void;
  addNewRow?: () => void;
  initialValue?: number;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(() => (initialValue ? initialValue : 0));
  console.log({ options, value });
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between dark:bg-blue-400">
          {value ? options.find((opt) => opt.id === value)?.name : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-full p-0">
        <Command>
          <div className={`flex`}>
            <CommandInput placeholder="חפש" />
            {addNewRow && (
              <Button onPointerDown={addNewRow} variant={"ghost"}>
                <Plus />
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>לא נמצאו תוצאות..</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(Number(currentValue) === value ? 0 : Number(currentValue));
                    setOpen(false);
                    cb && cb(Number(currentValue));
                  }}
                >
                  {opt.name}
                  <Check className={cn("ml-auto", value === opt.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ItemSelectionMulti({
  options,
  cb,
  addNewRow,
  initialValues,
  // selectedView,
  title = "בחר",
}: {
  options: Opt[];
  cb?: (val: Opt[]) => void;
  // selectedView:(vals:OptMult[])=>React.ReactNode;
  addNewRow?: () => void;
  initialValues?: number[];
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Opt[]>(() => {
    const initials = options.filter((op) => initialValues?.includes(op.id));
    if (initials.length) return initials;
    return [];
  });
  const popOverRef = useRef<HTMLDivElement>(null);
  console.log({ options, values });
  // useClickOutSide(popOverRef, () => setOpen(false));

  useEffect(() => {
    if (cb) cb(values);
  }, [values]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between dark:bg-blue-400">
          {/* {values.length ? options.find((opt) => values.includes(opt.value.toString()))?.label : title} */}
          {values?.map((sel) => (
            <Button onPointerDown={() => setValues(values.filter((s) => s.id !== sel.id))} className={`p-1`} variant={"ghost"}>
              {sel.name}
            </Button>
          ))}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={popOverRef} className="min-w-full p-0">
        <Command>
          <div className={`flex relative`}>
            <Button onPointerDown={() => setOpen(false)} variant={"ghost"} className={`p-0 left-0 top-0`}>
              <X size={8} />
            </Button>
            <CommandInput placeholder="חפש" />
            {addNewRow && (
              <Button onPointerDown={addNewRow} variant={"ghost"}>
                <Plus />
              </Button>
            )}
          </div>
          <CommandList>
            <CommandEmpty>לא נמצאו תוצאות..</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.id.toString()}
                  onSelect={(currentValue) => {
                    const cv = Number(currentValue);
                    const inArray = values.find((v) => v.id === cv);
                    if (inArray) {
                      setValues(values.filter((v) => v.id !== cv));
                      return;
                    }
                    const newValue = options.filter((op) => op.id === cv)[0];

                    setValues([...values, newValue]);
                    // setOpen(false);
                    // cb && cb(currentValue);
                  }}
                >
                  {opt.name}
                  <Check className={cn("ml-auto", values.find((op) => op.id === opt.id) ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
