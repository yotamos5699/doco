export type FileAttachment = {
  fileName: string;
  mimeType: string;
  data: string;
};

export type MailAttachment = {
  id: string;
  meta: {
    // innerDate: string;
    size: number;
    valueDate: number;
    createdAt: number;
    updatedAt: number;
    mailId: string | null | undefined;
    fileName: string;
    mimeType: string;
    selected: boolean;
    // attachment: FileAttachment;
  };
  linkUrl: string | null;
  dataUrl: string | null;
  base64String: string;
};
export type DocoDocument = {
  id: string;
  createdAt: number;
  updatedAt: number;
  innerDate: string;
  folderId: string;
  mailId: string | null | undefined;

  // isValid: boolean;

  url: string;
};

export type MailMeta = {
  id: string;
  exists: boolean;
  createdAt: number;
  updatedAt: number;
  internalDate: string;
  snippet: string | null | undefined;
  subject: string;
  filesAmount: number;
  filesExists: number;
  labelIds: string[] | null | undefined;
  sizeEstimate: number | null | undefined;
  fromName: string;
  fromEmail: string;
};
