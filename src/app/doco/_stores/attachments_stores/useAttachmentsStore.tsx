import { create } from "zustand";
import { NewAttachmentsData } from "../../attachments/_utils/getNewAttachmentsData";
import { GenericModelData } from "@/app/_components/fregs/GenericModelWrapper";
import { useAttachmentsAsyncStore } from "./useAttachmentsAsyncStore";
import { putAttachment } from "../../_utils/saveAttachment";

type AttachmentsStoreProps = {
  ids: Set<string>;
  selectedAttachments: Set<string>;
  setSelectedAttachments: (id: string) => void;
  urls: Map<string, string>;

  // removeAttachment: (id: string) => void;
  mailsData: Map<string, NewAttachmentsData[number]["emailData"]>;
  setMailsData: (vals: [string, NewAttachmentsData[number]["emailData"]][]) => void;

  // attachments: MailAttachment[];
  md: GenericModelData | null;
  setMd: (md: GenericModelData | null) => void;
  // setAttachments: (vals: MailAttachment[], persist?: boolean) => void;
};
//

const updateDbSelected = async (id: string, selected: boolean) => {
  console.log("updating selected");

  const doc = useAttachmentsAsyncStore.getState().attachments.filter((d) => d.id === id)[0];
  console.log({ doc });
  putAttachment({ ...doc, meta: { ...doc.meta, selected } });
};
export const useAttachmentsStore = create<AttachmentsStoreProps>((set) => ({
  expended: new Set(),
  ids: new Set(),
  selectedAttachments: new Set(),
  setSelectedAttachments: (id) =>
    set((state) => {
      const idExist = state.selectedAttachments.has(id);

      const newList = idExist
        ? [...state.selectedAttachments.values().filter((id_) => id_ !== id)]
        : [...state.selectedAttachments.values(), id];
      updateDbSelected(id, !idExist);
      return {
        selectedAttachments: new Set(newList),
      };
    }),
  urls: new Map(),
  selections: new Set(),

  mailsData: new Map(),
  setMailsData: (vals) => set({ mailsData: new Map(vals) }),

  md: null,
  setMd: (md) => set({ md }),
}));

export const useAttachmentSelected = (id: string) => {
  const list = useAttachmentsStore((state) => state.selectedAttachments);
  // console.log({ list });
  return list.has(id);
};

export const useMailData = (id?: string | null) => {
  const mailsMetas = useAttachmentsStore((state) => state.mailsData);
  console.log({ id, meta: mailsMetas });
  if (!id) return null;
  return mailsMetas.get(id) ?? null;
};
