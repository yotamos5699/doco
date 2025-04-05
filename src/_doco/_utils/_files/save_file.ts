// "use strict";
"use server";

import { getDriveClient } from "../../_google/clients";
import { progressTracker } from "./progressTracker";
import { Readable } from "stream";
import { getCachedBaseFolderId } from "../_folders/foldersUtils";
import { drive_v3 } from "googleapis";
import { getRelevantFileData } from "../factories";
import { FileMetaData } from "../save_file_utils/types";
import { decodeBase64 } from "../../../_bin/urlProcessing";

export type UploadResult = {
  fileId: string;
  webViewLink: string | null;

  // attachment: MailAttachment;
};
const monthWord = {
  1: "ינואר",
  2: "פבואר",

  3: "מרץ",
  4: "אפריל",
  5: "מאי",
  6: "יוני",
  7: "יולי",
  8: "אוגוסט",
  9: "ספטמבר",
  10: "אוקטובר",
  11: "נובמבר",
  12: "דצמבר",
};
new Date().toJSON();
const stringifyMetaData = (properties: FileMetaData) =>
  Object.entries(properties).reduce((acc, [key, value]) => {
    // Convert values to strings for storage
    acc[key] = JSON.stringify(value);
    return acc;
  }, {} as { [key: string]: string });

export async function saveAttachmentToDrive({
  fileId,
  data,
  size,
  permissions = [],
  properties,
  mimeType,
  folderId,
  filename,
}: // onProgress,
{
  fileId: string;
  data: string;
  size: number;
  // meta: { uid: string; supplier: string; amount: number };
  permissions?: drive_v3.Schema$Permission[];
  properties?: Record<string, string | number | boolean>;
  mimeType?: string;
  folderId?: string;
  filename?: string;

  // onProgress?: (progress: number) => void;
}) {
  // 2;
  const drive = await getDriveClient();
  drive.files.watch;
  const base64String = await decodeBase64(data);
  // const fileId = attachment.id;
  progressTracker.startUpload(fileId);
  console.log({ data, mimeType, filename });
  try {
    const baseFolder = await getCachedBaseFolderId();

    // Create the file
    const response = await drive.files
      .create(
        {
          // .... include meta data
          requestBody: {
            name: filename || "attachment",

            mimeType: mimeType || "application/octet-stream",
            parents: folderId ? [folderId] : [baseFolder],
            permissions,
            properties: properties ? stringifyMetaData(properties) : undefined,
          },
          media: {
            mimeType,
            // body: Readable.from(Buffer.from(data.split(",")[1], "base64")),
            body: Readable.from(Buffer.from(base64String)),
          },

          fields: "id,name",
        },
        {
          onUploadProgress: (evt) => {
            console.log("server progress:", { evt });
            progressTracker.updateProgress(fileId, evt.bytesRead, size);
          },
        }
      )
      .finally(() => {
        progressTracker.removeUpload(fileId);
      });

    return getRelevantFileData(response.data);
  } catch (error) {
    throw error;
  }
}
