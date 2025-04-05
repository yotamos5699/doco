import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAttachmentsAsyncStore } from "../_stores/attachments_stores/useAttachmentsAsyncStore";
import { useAttachmentsStore } from "../_stores/attachments_stores/useAttachmentsStore";

export const useUpperNavData = () => {
  const mailsData = useAttachmentsAsyncStore(useShallow((state) => state.mailsMapData));
  const setMailsMetaMap = useAttachmentsStore().setMailsData;
  useEffect(() => {
    if (mailsData?.length) {
      setMailsMetaMap(mailsData);
      console.log({ mailsData });
    }
  }, [mailsData]);
  return null;
};
