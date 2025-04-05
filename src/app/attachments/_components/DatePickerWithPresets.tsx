"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar as CalendarIcon, FolderOpen, FolderOpenDotIcon, FoldHorizontal } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFoldersExplorerStore } from "../../../_doco/SessionCache";
import { useState } from "react";
type PresetRange = "last_day" | "to_today" | "7_days" | "14_days" | "month" | "3_month";

export function DatePicker({ initial, cb }: { initial?: Date; cb: (d: Date) => void }) {
  const [date, setDate] = React.useState<Date | undefined>(() => initial);
  React.useEffect(() => {
    date && cb(date);
  }, [date]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon />
          {date ? format(date, "LLL dd, y", { locale: he }) : <span>בחר טווח</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

export function DatePickerWithPresets({ className }: React.HTMLAttributes<HTMLDivElement>) {
  //  const [preset,setPreset] = useState<PresetRange>("to_today")
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const d = setDateRangePreset("7_days");
    return {
      from: d.from,
      to: d.to,
    };
  });
  const updateDateRange = useFoldersExplorerStore((state) => state.updateDateRange);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px]  justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: he })} - {format(date.to, "LLL dd, y", { locale: he })}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>בחר טווח</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <RangesPresets
            cb={(id) => {
              const presetRange = setDateRangePreset(id);
              setDate(presetRange);
              updateDateRange(presetRange);
            }}
          />
          <Calendar
            //  initialFocus

            locale={he}
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(dr) => {
              setDate(dr);
              updateDateRange(dr);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

const rangesPresets: { id: PresetRange; label: string }[] = [
  { id: "to_today", label: "עד היום" },
  { id: "last_day", label: "מאתמול" },
  { id: "7_days", label: "שבוע אחרון" },
  { id: "14_days", label: "שבועיים" },
  { id: "month", label: "חודש אחרון" },
  { id: "3_month", label: "שלושה חודשים" },
];
const RangesPresets = ({ cb }: { cb: (id: PresetRange) => void }) => (
  <div className={`flex flex-wrap`}>
    {rangesPresets.map((preset) => (
      <Button onPointerDown={() => cb(preset.id)} variant={"link"}>
        {preset.label}
      </Button>
    ))}
  </div>
);

const setDateRangePreset = (id: PresetRange): DateRange => {
  const now = new Date();

  switch (id) {
    case "last_day": {
      return {
        from: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        to: now,
      };
    }

    case "to_today": {
      const lastSynced = useFoldersExplorerStore.getState().lastSynced;
      return {
        from: lastSynced ? new Date(lastSynced.range.from) : new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        to: now,
      };
    }

    case "7_days": {
      return {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      };
    }

    case "14_days": {
      return {
        from: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        to: now,
      };
    }

    case "month": {
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: now,
      };
    }

    case "3_month": {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

      // Handle dates that don't exist in previous months (like Feb 31st)
      if (threeMonthsAgo.getMonth() !== now.getMonth() - 3) {
        threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 1);
      }

      return {
        from: threeMonthsAgo,
        to: now,
      };
    }
  }
};
