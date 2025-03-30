"use server";
import { db } from "../_indexed/db";
import { DocoDocument, MailAttachment, MailMeta } from "../_indexed/schemas";

type DbTable = "documents" | "attachments";

export const addDocuments = async (
  docs:
    | { type: "attachments"; data: MailAttachment[] }
    | { type: "documents"; data: DocoDocument[] }
    | { type: "mailsMeta"; data: MailMeta[] }
) => {
  switch (docs.type) {
    case "documents":
      return await db.documents
        .bulkPut(docs.data)
        .then((addBulkRes) => {
          console.log({ addBulkRes });
          return docs.data;
        })
        .catch((addBulkError) => {
          console.log({ addBulkError });
          return null;
        });
    case "attachments":
      return await db.attachments
        .bulkPut(docs.data)
        .then((addBulkRes) => {
          console.log({ addBulkRes });
          return docs.data;
        })
        .catch((addBulkError) => {
          console.log({ addBulkError });
          return null;
        });
    case "mailsMeta":
      return await db.mailsMeta
        .bulkPut(docs.data)
        .then((addBulkRes) => {
          console.log({ addBulkRes });
          return docs.data;
        })
        .catch((addBulkError) => {
          console.log({ addBulkError });
          return null;
        });
  }
};
//

export async function putAttachment(data: MailAttachment) {
  return await db.attachments.put(data);
}
export async function getDocuments(type: "attachments"): Promise<MailAttachment[]>;
export async function getDocuments(type: "documents"): Promise<DocoDocument[]>;
export async function getDocuments(type: "mailsMeta"): Promise<MailMeta[]>;
export async function getDocuments(type: "documents" | "attachments" | "mailsMeta") {
  switch (type) {
    case "documents":
      return await db.documents.limit(30).toArray();
    case "attachments":
      return await db.attachments.limit(30).toArray();
    case "mailsMeta":
      return await db.mailsMeta.limit(30).toArray();
  }
}
export async function delDocuments(type: "attachments"): Promise<boolean>;
export async function delDocuments(type: "documents"): Promise<boolean>;
export async function delDocuments(type: "mailsMeta"): Promise<boolean>;

export async function delDocuments(type: "documents" | "attachments" | "mailsMeta") {
  switch (type) {
    case "documents": {
      return await db.documents
        .clear()
        .then(() => true)
        .catch(() => false);
    }
    case "attachments":
      return await await db.attachments
        .clear()
        .then(() => true)
        .catch(() => false);
    case "mailsMeta":
      return await db.mailsMeta
        .clear()
        .then(() => true)
        .catch(() => false);
  }
}
export async function delDocument(type: "attachments", id: string): Promise<boolean>;
export async function delDocument(type: "documents", id: string): Promise<boolean>;
export async function delDocument(type: "mailsMeta", id: string): Promise<boolean>;

export async function delDocument(type: "documents" | "attachments" | "mailsMeta", id: string) {
  switch (type) {
    case "documents": {
      return await db.documents
        .delete(id)
        .then(() => true)
        .catch(() => false);
    }
    case "attachments":
      return await await db.attachments
        .delete(id)
        .then(() => true)
        .catch(() => false);
    case "mailsMeta":
      return await db.mailsMeta
        .delete(id)
        .then(() => true)
        .catch(() => false);
  }
}
// export async function getDocument(type: "attachments", id: string): Promise<MailAttachment>;
// export async function getDocument(type: "documents", id: string): Promise<DocoDocument>;
// export async function getDocument(type: "documents" | "attachments", id: string) {
//   switch (type) {
//     case "documents":
//       return await db.documents.get(id);
//     case "attachments":
//       return await db.attachments.get("");
//   }
// }

// export const addDocument = async (doc: { type: "attachments"; data: MailAttachment } | { type: "documents"; data: DocoDocument }) => {
//   switch (doc.type) {
//     case "documents":
//       return await db.documents
//         .put(doc.data)
//         .then((addSingleRes) => {
//           console.log({ addSingleRes });
//           return doc.data;
//         })
//         .catch((addSingleError) => {
//           console.log({ addSingleError });
//           return null;
//         });
//     case "attachments":
//       return await db.attachments
//         .put(doc.data)
//         .then((addSingleRes) => {
//           console.log({ addSingleRes });
//           return doc.data;
//         })
//         .catch((addSingleError) => {
//           console.log({ addSingleError });
//           return null;
//         });
//     // return doc.data;
//   }
// };
