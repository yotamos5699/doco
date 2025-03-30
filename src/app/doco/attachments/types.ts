import { ButtonProps } from "@/components/ui/button";
import { gmail_v1 } from "googleapis";
export const docoStyle_ = { btn: { css: "flex gap-2", size: 14 }, vari: "link" as ButtonProps["variant"] };

export type MailPromise = {
  email: gmail_v1.Schema$Message;
  attachments: {
    fileName: string;
    mimeType: string;
    data: string;
  }[];
};

export type AttachmentItem = {
  partId: string;
  sizeEstimate: number;
  messageId: string;
  fileName: string;
  mimeType: string;
  attachmentId: string;
  exists: boolean;
};

export type UploadStatus = "waiting" | "started" | "finished";
export type Stat = { progress: number; status: UploadStatus };
export type UploadStats = Map<string, Stat>;
