"use server";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import { getGmailClient } from "../../../_doco/_google/clients";
import { AttachmentItem } from "../types";
import { getUnixTimestamp } from "./utils";
import { gmail_v1 } from "googleapis";
import { generateMailMeta, getHeader } from "../../../_doco/_utils/factories";

const getEmailsResponses = async (emailPromises: GaxiosPromise<gmail_v1.Schema$Message>[]) =>
  (await Promise.all(emailPromises)).filter((d) => d.data.id);
// .map((e) => e);

const createEmailsListMap = async (messages: gmail_v1.Schema$Message[], gmail: gmail_v1.Gmail) => {
  const emailPromises: GaxiosPromise<gmail_v1.Schema$Message>[] = [];
  for (let i = 0; i < messages.length; i++) {
    let msg = messages[i];
    // msg.

    emailPromises.push(gmail.users.messages.get({ userId: "me", id: msg.id! }));
  }
  let emailsMapData: Awaited<ReturnType<typeof getEmailsResponses>> = await getEmailsResponses(emailPromises);
  return { emailsListMap: new Map(emailsMapData.map((d) => [d.data.id, d])), emailsMapData };
};

export type NewAttachmentsData = Awaited<ReturnType<typeof getNewAttachmentsData>>;
export const getNewAttachmentsData = async ({
  existingList = [],
  maxResults = 10,
  query,
}: {
  existingList?: string[];
  maxResults?: number;
  query: string;
}) => {
  // console.log("in getNewAttachmentsData");
  const existing = new Set(existingList);
  const gmail = await getGmailClient();

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    q: `has:attachment ${query}`,
  });

  if (!response.data.messages?.length) return [];

  const { emailsListMap, emailsMapData } = await createEmailsListMap(response.data.messages, gmail);
  const attachmentsPromiseList: Promise<Omit<AttachmentItem, "exists">[]>[] = [];
  const date = getUnixTimestamp();
  for (const email of emailsListMap.values()) {
    attachmentsPromiseList.push(extractAttachments(email.data));
  }

  const messages = await Promise.all(attachmentsPromiseList);
  // console.log({ messages });
  // messages.forEach((m) => console.log({ messageData: m }));

  const attachmentsMetaListMap = new Map(messages.filter((d) => d[0]?.messageId).map((d) => [d[0].messageId, d]));
  // console.log({ existing });

  const response_: {
    attachments: AttachmentItem[];
    emailData: ReturnType<typeof generateMailMeta> & { exists: boolean; filesAmount: number; filesExists: number };
  }[] = [];

  for (const d of emailsMapData) {
    // .map((d) => {
    let attachments: AttachmentItem[] = [];
    let filesAmount = 0;
    let filesExists = 0;
    const attachmentsData = attachmentsMetaListMap.get(d.data.id ?? "");
    if (attachmentsData) {
      filesAmount = attachmentsData.length;
      for (const attachment of attachmentsData) {
        let exists = existing.has(attachment.partId);
        if (exists) {
          filesExists++;
        }
        attachments.push({ ...attachment, exists });
      }
    }

    const emailData = { ...generateMailMeta(d.data, date), exists: existing.has(d.data?.id ?? ""), filesAmount, filesExists };
    if (attachments.length)
      response_.push({
        emailData,
        attachments,
      });
  }

  // '19556568f270c9df'
  // '19556568f270c9df'

  return response_;
};

const extractAttachments = async (message: gmail_v1.Schema$Message) => {
  const attachmentsList: Omit<AttachmentItem, "exists">[] = [];
  const messageId = message?.id;
  if (!message.payload || !message.payload.parts || !messageId) {
    // console.log("erly return: ", { message });
    return attachmentsList;
  }

  const parts = message.payload.parts;
  let attachmentsData = getAttachmentsRecursive(parts, messageId);

  for (const attachment of attachmentsData) {
    attachmentsList.push({ ...attachment, messageId });
  }

  return attachmentsList;
};

const getAttachmentsRecursive = (parts: gmail_v1.Schema$MessagePart[], messageId: string) => {
  let attachments: { partId: string; sizeEstimate: number; fileName: string; attachmentId: string; mimeType: string }[] = [];

  for (const part of parts) {
    if (part.parts) {
      attachments = attachments.concat(getAttachmentsRecursive(part.parts, messageId));
    } else if (part.filename && part.body?.attachmentId) {
      // console.log({ part });
      // if (part.mimeType !== "application/octet-stream")
      attachments.push({
        partId: `${messageId}/${part.partId}`,
        sizeEstimate: part.body.size ?? 0,
        fileName: part.filename,
        attachmentId: part.body.attachmentId,
        mimeType: part.mimeType ?? "application/octet-stream",
      });
    }
  }

  return attachments;
};
