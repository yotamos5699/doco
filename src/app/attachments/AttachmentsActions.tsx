"use client";

import { CardDescription } from "@/components/ui/card";
import { useAttachmentsAsyncStore } from "../../_doco/_stores/attachments_stores/useAttachmentsAsyncStore";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";

export const AttachmentsActions = () => {
  return (
    <CardDescription className={`flex flex-col`}>
      <AttachmentsSpecs />
    </CardDescription>
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
