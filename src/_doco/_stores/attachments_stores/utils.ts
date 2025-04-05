import { useAttachmentsStore } from "./useAttachmentsStore";

export const idInExistingIds = (id: string) => useAttachmentsStore.getState().ids.has(id);
