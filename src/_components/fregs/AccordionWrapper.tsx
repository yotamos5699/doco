import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";

export function AccordionWrapper({
  itemKey,
  title,
  children,
  currentKey,
  handleTriger,
}: {
  itemKey: string;
  title: string;
  children: React.ReactNode;
  currentKey: string;
  handleTriger: (sec: string, val: string) => void;
}) {
  console.log({ currentKey, itemKey });
  return (
    <Accordion value={currentKey} type="single" collapsible className="w-full">
      <AccordionItem className={`border-slate-400  border-opacity-60`} value={itemKey}>
        <AccordionTrigger className={`p-1`} id={itemKey} onClick={(e) => handleTriger(itemKey, currentKey ? "" : itemKey)}>
          <span className={`text-sm opacity-70 `}>{title}</span>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
