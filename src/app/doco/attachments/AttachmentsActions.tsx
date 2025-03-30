"use client";

import { CardDescription } from "@/components/ui/card";
import { useAttachmentsAsyncStore } from "../_stores/attachments_stores/useAttachmentsAsyncStore";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";

export const AttachmentsActions = () => {
  return (
    // <div className={`flex flex-col`}>
    <CardDescription className={`flex flex-col`}>
      <AttachmentsSpecs />
      {/* <div className={`flex gap-1`}>
        <Button className={`h-5 text-xs w-16 `} variant={"secondary"}>
          sd1
        </Button>
        <Button className={`h-5 text-xs w-16 `} variant={"secondary"}>
          sd2
        </Button>
        <Button className={`h-5 text-xs w-16 `} variant={"secondary"}>
          sd3
        </Button>
      </div> */}
    </CardDescription>

    // </div>
  );
};

const useAttachmentsSpec = () => {
  const attachments = useAttachmentsAsyncStore(useShallow((state) => state.attachments));
  return { amount: attachments.length };
};

const AttachmentsSpecs = () => {
  const spec = useAttachmentsSpec();

  return (
    <div className={`text-[10px] p-1 border-b border-slate-400/60 `}>
      <span>סה"כ</span>
      <span>{spec.amount}</span> .
    </div>
  );
};
