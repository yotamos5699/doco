import "fake-indexeddb/auto";
import Dexie, { type EntityTable } from "dexie";
import { DocoDocument, MailAttachment, MailMeta } from "./schemas";
// import { cache } from "react";
// import

// type Friend {
//   id: number;
//   name: string;
//   age: number;
// }
// const getCachedRefreshToken  = cache(async ()=>{
//   const sess
// })
// type AttachmentsCache = { id: string; data: string };
// & any
const db = new Dexie("FriendsDatabase") as Dexie & {
  // attachments_storage: EntityTable<AttachmentsCache, "id">;
  // "id" // primary key "id" (for the typings only)
  attachments: EntityTable<
    MailAttachment,
    "id" // primary key "id" (for the typings only)
  >;
  documents: EntityTable<
    DocoDocument,
    "id" // primary key "id" (for the typings only)
  >;
  mailsMeta: EntityTable<
    MailMeta,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(5.23).stores({
  // attachments_storage: "id",

  attachments: "id,createdAt,updatedAt", // primary key "id" (for the runtime!)
  documents: "id,createdAt,updatedAt",
  mailsMeta: "id,createdAt,updatedAt",
});

// export type { Friend };
export { db };
