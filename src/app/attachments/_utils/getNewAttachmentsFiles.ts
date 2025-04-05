"use server";
import { gmail_v1 } from "googleapis";
import { MailAttachment } from "../../../_doco/_indexed/schemas";
import { generateMailAttachment } from "../../../_doco/_utils/factories";
import { getGmailClient } from "../../../_doco/_google/clients";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import { AttachmentItem } from "../types";
import { NewAttachmentsData } from "./getNewAttachmentsData";
import { GaxiosResponse } from "gaxios";
import { error } from "console";
import { getUnixTimestamp } from "./utils";
// import { getGmailClient } from "../SessionCache";

const extractBlobAttachmentId = (blob: GaxiosResponse<gmail_v1.Schema$MessagePartBody>) => {
  // const conf = blob.config;

  const params = blob.config.url?.toString().split("/");
  if (!params) return null;

  return { attachmentId: params[params?.length - 1], messageId: params[params.length - 3] };
};

export type GetAttachmentsFilesData = Awaited<ReturnType<typeof getNewAttachmentsFiles>>;
export const getNewAttachmentsFiles = async ({ data }: { data: NewAttachmentsData }) => {
  try {
    // console.log({ filesMetaDataToGet: data });
    //
    const gmail = await getGmailClient();
    // attachmentsPromiseList.push( extractAttachments( email.data))
    const emailsListMap = new Map(data.map((d) => [d.emailData.id, d]));

    const attachmentsPromises: GaxiosPromise<gmail_v1.Schema$MessagePartBody>[] = [];
    const attachmentsMetaMap = new Map<string, AttachmentItem>();
    // console.log({ filesMapMetaDataToGet: emailsListMap.entries() });
    for (const attachments of data) {
      if (!attachments.attachments) continue;
      for (const attachment of attachments.attachments) {
        const { attachmentId, messageId } = attachment;
        attachmentsMetaMap.set(attachment.attachmentId, attachment);
        attachmentsPromises.push(
          gmail.users.messages.attachments.get({
            userId: "me",
            messageId,
            id: attachmentId,
          })
        );
      }
    }
    const mailAttachments: MailAttachment[] = [];
    const date = getUnixTimestamp();

    const attachmentsBlobs = await Promise.all(attachmentsPromises);

    for (const attachmentBlob of attachmentsBlobs) {
      const params = extractBlobAttachmentId(attachmentBlob);
      // console.log({ params });
      if (!params) continue;
      attachmentBlob.data.data;
      const { attachmentId, messageId } = params;
      const attachment = attachmentsMetaMap.get(attachmentId);
      const mailData = emailsListMap.get(messageId)?.emailData;

      if (!attachment || !mailData) continue;

      mailAttachments.push(
        generateMailAttachment({
          size: attachmentBlob.data.size ?? 0,
          attachmentId: attachment.partId,
          attachment: { ...attachment, data: attachmentBlob.data.data ?? "" },
          mailData,
          date,
          // valueDate:attachment.
        })
      );
    }
    // console.log({ mailAttachments });
    return { mailAttachments, mailsMeta: data.map((md) => md.emailData), error: null };
  } catch (error) {
    console.error("Error fetching emails with attachments:", { error });
    return { mailAttachments: [] as MailAttachment[], mailsMeta: [], error: error };
  }
};

// const recursePart = (part: gmail_v1.Schema$MessagePart) => {
//   console.log({ part });
//   const attachments: { fileName: string; mimeType: string; id: string }[] = [];
//   if(part.parts){

//   }
//   else if (part?.filename && part?.body && part?.body?.attachmentId) {
//     attachments.push({ id: part.body.attachmentId, fileName: part.filename ?? "", mimeType: part.mimeType ?? "" });
//   } else if (part?.parts) {
//     for (const recPart of part.parts) {
//       return recursePart(part);
//     }
//   }
//   return attachments;
// };

// Decode Base64 email body
