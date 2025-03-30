import { useAttachmentsMetaStore } from "../../../_stores/attachments_stores/useAttachmentsMetaStore";
import { useAttachmentsStore } from "../../../_stores/attachments_stores/useAttachmentsStore";
import { NewAttachmentsData } from "../../_utils/getNewAttachmentsData";

export const noMeta = (m: NewAttachmentsData) => {
  const isMeta = !!m.length;
  console.log({ isMeta });
  return !isMeta;
};
export const useNoSelections = (m: NewAttachmentsData) => {
  const selections = useAttachmentsMetaStore((state) => state.selections);
  for (let i = 0; i < m.length; i++) {
    const atts = m[i].attachments;
    if (!selections.has(m[i].emailData.id ?? "") || !atts?.length) continue;
    for (let j = 0; j < atts.length; j++) {
      if (!atts[j].exists && selections.has(atts[j].attachmentId)) return false;
    }
  }

  return true;
};
