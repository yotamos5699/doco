"use server";
// import { db } from "../_indexed/db";
// import { MaileMapItem } from "../_stores/attachments_stores/useAttachmentsAsyncStore";
// import { MailAttachment } from "./schemas";

// export const attachmentsStorageSet = async (data: any) => {
//   console.log({ data_to_put: data });
//   return await db.attachments_storage.put({ id: "attachments_storage", data }).catch((put_error) => console.log({ put_error }));
// };
// export const attachmentsStorageGet = async () => {
//   const item_data = await db.attachments_storage.get("attachments_storage");
//   console.log({ item_data });
//   return item_data || null;
// };
// export const setInitialData = async () => {
//   console.log("initial data");
//   return db.attachments_storage
//     .get("attachments_storage")
//     .then(async (data) => {
//       if (!data?.data) return null;
//       const data_res = (await JSON.parse(data.data)) as { state: { attachments: MailAttachment[]; mailsMapData: MaileMapItem[] } };
//       console.log({ data_res });
//       return data_res;
//     })
//     .catch((iniial_data) => {
//       console.log({ iniial_data });
//       return null;
//     });
// };
// export const attachmentsStorageClear = async () => await db.attachments_storage.clear();
