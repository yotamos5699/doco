"use client";
import { useAttachmentsStore } from "../_stores/attachments_stores/useAttachmentsStore";
import { GenericModelContainer } from "@/_components/GenericModelContainer";

export const DocoModelsWrapper = () => {
  const md = useAttachmentsStore((state) => state.md);
  const setMd = useAttachmentsStore((state) => state.setMd);
  return <GenericModelContainer md={md} setMd={setMd} className={md?.css} />;
};
