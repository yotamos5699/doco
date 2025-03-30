import { create } from "zustand";
import { NewAttachmentsData } from "../../attachments/_utils/getNewAttachmentsData";

type MetaStoreProps = {
  toggleSelections: (id: string) => void;
  toggleExpended: (id: string) => void;

  meta: NewAttachmentsData;
  setMeta: (v: NewAttachmentsData) => void;
  clearMeta: () => void;
  expended: Set<string>;
  selections: Set<string>;
};

export const useAttachmentsMetaStore = create<MetaStoreProps>((set) => ({
  expended: new Set(),
  selections: new Set(),
  meta: [],
  setMeta: (meta) => {
    const ids: string[] = [];

    for (let i = 0; i < meta.length; i++) {
      ids.push(meta[i].emailData.id ?? "");
      const atts = meta[i].attachments;
      if (!atts) continue;
      for (let j = 0; j < atts.length; j++) {
        ids.push(atts[j].attachmentId);
      }
    }

    set({ meta, selections: new Set(ids) });
  },
  toggleExpended: (id) => {
    return set((state) => {
      if (state.expended.has(id)) {
        state.expended.delete(id);
        // return;
      } else {
        state.expended.add(id);
      }

      return { expended: new Set(state.expended) };
    });
  },
  toggleSelections: (id) => {
    return set((state) => {
      if (state.selections.has(id)) {
        state.selections.delete(id);
        // return;
      } else {
        state.selections.add(id);
      }

      return { selections: new Set(state.selections) };
    });
  },

  clearMeta: () => set({ meta: [], selections: new Set(), expended: new Set() }),
}));
