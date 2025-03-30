// import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { create } from "zustand";
import { MailAttachment } from "../../_indexed/schemas";
// import { attachmentsStorageClear, attachmentsStorageGet, attachmentsStorageSet, setInitialData } from "../../_indexed/storageUtils";
import { NewAttachmentsData } from "../../attachments/_utils/getNewAttachmentsData";
import { useAttachmentsStore } from "./useAttachmentsStore";
import { GetAttachmentsFilesData } from "../../attachments/_utils/getNewAttachmentsFiles";
import { addDocuments, delDocument, delDocuments } from "../../_utils/saveAttachment";
type SetDataUrlProps =
  | { type: "data"; id: string; data?: string; dataUrl?: string; mimeType?: string }
  | { type: "url"; id: string; data: string }
  | { type: "link"; id: string; data: string };
export const setAttachmentDataUrl = (data: SetDataUrlProps) => {
  // setAttachmentDataUrl:(id,url)=> set(state=>{
  const prev_attachments = useAttachmentsAsyncStore.getState().attachments;
  const edited_att = prev_attachments.filter((a) => a.id === data.id)[0];

  switch (data.type) {
    // const attachments = state.attachments.map(att=>att.id !== id ? att: edited_att )
    case "data": {
      addDocuments({
        type: "attachments",
        data: [
          { ...edited_att, dataUrl: data.dataUrl ?? edited_att.dataUrl, linkUrl: "", base64String: data.data ?? edited_att.base64String },
        ],
      });
      break;
    }
    case "url": {
      addDocuments({ type: "attachments", data: [{ ...edited_att, dataUrl: data.data }] });
      break;
    }
    case "link": {
      addDocuments({ type: "attachments", data: [{ ...edited_att, linkUrl: data.data }] });
    }
    // return {attachments}
    // })
  }
};

export type MaileMapItem = [string, NewAttachmentsData[number]["emailData"]];
type AttachmentsAsyncStoreProps = {
  mailsMapData: MaileMapItem[];
  removeAttachment: (id: string) => void;
  attachments: MailAttachment[];
  // setAttachmentDataUrl:(id:string,url:string)=>void;
  setAttachments: (vals: GetAttachmentsFilesData) => void;
  clearAttachments: () => void;
};

export const useAttachmentsAsyncStore = create<AttachmentsAsyncStoreProps, [["zustand/persist", unknown]]>(
  // persist(
  (set, get) => ({
    mailsMapData: [],

    attachments: [],

    removeAttachment: (id) => {
      delDocument("attachments", id);

      return set((state) => {
        const atts = state.attachments.filter((a) => a.id !== id);
        const mailIds = new Set(atts.map((a) => a.meta.mailId));
        const mailsMapIds = new Set(state.mailsMapData.map((d) => d[0]));

        const mailsMeta2Remove = mailsMapIds.difference(mailIds);
        mailsMeta2Remove.values().map((id) => delDocument("mailsMeta", id));
        if (mailsMeta2Remove.size === 0) return { attachments: atts };
        const newMailsData = state.mailsMapData.filter(([id, d]) => !mailsMapIds.has(id));
        useAttachmentsStore.getState().setMailsData(newMailsData);
        return { attachments: atts, mailsMapData: newMailsData };
      });

      // set((state) => ({ attachments: state.attachments.filter((att) => att.id !== id) }))
    },

    setAttachments: (data) => {
      // if(data)
      addDocuments({ type: "mailsMeta", data: data.mailsMeta });
      addDocuments({ type: "attachments", data: data.mailAttachments });
      const mailsData = data.mailsMeta.map((d) => [d.id, d] as [string, NewAttachmentsData[number]["emailData"]]);
      return set({ attachments: data.mailAttachments, mailsMapData: mailsData });
    },
    clearAttachments: () => {
      delDocuments("attachments");
      delDocuments("mailsMeta");
      useAttachmentsStore.getState().setMailsData([]);
      return set({ attachments: [], mailsMapData: [] });
    },
  })
  // )
);
// const storage: StateStorage = {
//   getItem: async (): Promise<string | null> => {
//     console.log("data has been retrieved");
//     // await db.open();
//     if (!storeHydrated) return null;
//     const item = await attachmentsStorageGet();
//     console.log({ getData: item });
//     return item ? item.data : null;
//   },

//   setItem: async (name: string, value: string): Promise<void> => {
//     console.log({ value });
//     console.log("setting item", value, "has been saved");

//     await attachmentsStorageSet(value);
//     // await db.attachments.put(data);
//   },

//   removeItem: async (): Promise<void> => {
//     console.log("has been deleted");
//     await attachmentsStorageClear();
//     // await db.attachments.where("id").equals(name).delete();
//   },
// };
// {
//   name: "attachments_storage",
//   storage: createJSONStorage(() => storage),
//   partialize: (state) => {
//     console.log({ persistStorage: state });
//     return { attachments: state.attachments, mailsMapData: state.mailsMapData };
//   },
//   onRehydrateStorage: (state) => {
//     console.log("hydration starts", { state });

//     // optional
//     return (state, error) => {
//       if (error) {
//         console.log("an error happened during hydration", error);
//       } else {
//         console.log("hydration finished");
//       }
//       storeHydrated = true;

//       // setInitialData();
//     };
//   },
// }

//
// export const useAttachmentsStore = create<AttachmentsAsyncStoreProps>(
//   persist(
//     (set) => ({
//       removeAttachment: (id) => set((state) => ({ attachments: state.attachments.filter((att) => att.id !== id) })),

//       attachments: [],
//       setAttachments: (attachments) => set({ attachments }),

//       clearAttachments: () => set({ attachments: [] }),
//     }),
//     {
//       name: "food-storage", // unique name
//       storage: createJSONStorage(() => ....),
//     }
//   )
// );
