import { drive_v3, gmail_v1 } from "googleapis";
import { FileAttachment, MailAttachment, MailMeta } from "../_indexed/schemas";
import { parseFromHeader, trimValue } from "./formaters";
import { NewAttachmentsData } from "../attachments/_utils/getNewAttachmentsData";
import { FileMetaData } from "./save_file_utils/types";
export const generateAttachmentId = (mailId: string, filename: string) => `${mailId}-${filename}`;

export const parseMetaData = (properties: { [key: string]: string }): FileMetaData => {
  return Object.entries(properties).reduce((acc, [key, value]) => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(value);
      acc[key] = parsed;
    } catch (e) {
      // If not JSON, try to parse as number
      const num = Number(value);
      acc[key] = isNaN(num) ? value : num;
    }
    return acc;
  }, {} as FileMetaData);
};

export const generateMailMeta = (data: gmail_v1.Schema$Message, date: number): Omit<MailMeta, "exists" | "filesAmount" | "filesExists"> => {
  const payload = data.payload;
  const { id, labelIds, sizeEstimate, snippet, internalDate } = data;
  const from = parseFromHeader(getHeader(payload, "From"));
  return {
    ...from.data,
    subject: trimValue(getHeader(payload, "Subject")),
    createdAt: date,
    updatedAt: date,

    // date: trimValue(getHeader(payload, "Date")),
    id: id ?? "",
    labelIds,
    sizeEstimate,
    snippet,
    internalDate: internalDate ?? "",
  };
};

export const generateMailAttachment = ({
  size,
  attachmentId,
  attachment,
  mailData,
  date,
}: {
  size: number;
  attachmentId: string;
  attachment: FileAttachment;
  mailData: NewAttachmentsData[number]["emailData"];
  date: number;
}): MailAttachment => {
  // console.log({ email, attachment });

  const { data, fileName, mimeType } = attachment;
  // console.log("attachment factory:", { date, mailData });
  console.log("attachment factory:", { mailData, date });
  return {
    id: attachmentId,
    meta: {
      size,
      valueDate: Number(mailData.internalDate),
      // new Date(mailData.internalDate).getTime(),
      createdAt: date,
      updatedAt: date,
      mailId: mailData.id ?? "",
      fileName,
      mimeType,
      selected: false,
      // List of attachments
    },
    linkUrl: null,
    dataUrl: null,
    base64String: data,
  };
};
// webViewLink:
// webContentLink:
// permissions:
// id:
// name:
// createdTime:
type FileParamType = keyof drive_v3.Schema$File;
const FileFieldsList: FileParamType[] = [
  "id",
  "description",
  "permissions",
  "permissionIds",
  "name",
  "properties",
  "thumbnailLink",
  "webViewLink",
  "webContentLink",
] as const;

export const FileFieldsString = `files(${FileFieldsList.join(",")})`;
// id,description,permissionIds,name,properties,thumbnailLink,  webViewLink, webContentLink)

export const getRelevantFileData = (data: drive_v3.Schema$File) => {
  // console.log({ data, filePermissions: data.permissions });
  return {
    fileId: data.id,
    description: data.description,
    permissionIds: data.permissionIds,
    parents: data.parents,
    fileExtension: data.fileExtension,
    // permissions: data.permissions,
    fileName: data.name,
    properties: data.properties,
    // exportLinks: data.exportLinks,
    thumbnailLink: data.thumbnailLink,
    webViewLink: data.webViewLink,
    webContentLink: data.webContentLink,
  };
  // as Record<FileParamType & { fileId: string }, any>;
};

// Get email headers (Subject, From, Date)
export const getHeader = (payload: any, name: string): string => {
  return payload?.headers?.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || "Unknown";
};
// const decodeEmailBody = (payload: any): string => {
//   if (!payload?.parts) return "No body content";

//   const part = payload.parts.find((p: any) => p.mimeType === "text/plain") || payload.parts[0];

//   if (!part || !part.body || !part.body.data) return "No content available";

//   return Buffer.from(part.body.data, "base64").toString("utf-8");
// };
