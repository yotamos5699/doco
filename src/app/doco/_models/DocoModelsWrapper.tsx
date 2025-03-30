"use client";
import { useShallow } from "zustand/react/shallow";
import { useAttachmentsStore } from "../_stores/attachments_stores/useAttachmentsStore";
import { NewGenericModelContainer } from "@/_components/GenericModelContainer";

export const DocoModelsWrapper = () => {
  const md = useAttachmentsStore((state) => state.md);
  const setMd = useAttachmentsStore((state) => state.setMd);
  return <NewGenericModelContainer md={md} setMd={setMd} className={md?.css} />;
};
