import { useAttachmentsAsyncStore } from "./useAttachmentsAsyncStore";
import { useAttachmentsStore } from "./useAttachmentsStore";

// export const clearAttachmentsData = async () => {
//     const clearCache = useAttachmentsStore().clearAttachments;

//     return await Promise.all([delDocuments("attachments"), delDocuments("documents"), delDocuments("mailsMeta")]).finally(() => {
//       clearCache();
//       return true;
//     });
//   };

export const deleteAttachment = async (id: string) => {
  const removeAttachment = useAttachmentsAsyncStore.getState().removeAttachment;
  removeAttachment(id);
};
export const deleteAttachments = async () => {
  const clearCache = useAttachmentsAsyncStore().clearAttachments;

  // return await Promise.all([delDocuments("attachments"), delDocuments("documents"), delDocuments("mailsMeta")]).finally(() => {
  clearCache();
};
