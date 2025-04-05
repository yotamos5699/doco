import { getRelevantFileData } from "../factories";
import { getGmailLabelsAndGroups } from "./getGmailLabelsAndGroups";
export type AssignedPermission = "READER" | "WRITER" | "OWNER";
export type FileMetaData = { [key: string]: string | number | boolean | null | Date };
export type PremRole = "owner" | "organizer" | "fileOrganizer" | "writer" | "commenter" | "reader";
export type PremType = "user" | "group" | "domain" | "anyone";
export type PermType = { fileId: string; role: PremRole; type: PremType };
export type GetLabelsRetType = Awaited<ReturnType<typeof getGmailLabelsAndGroups>>;
export type FolderData = { updatedAt: string; id: string; name: string; path: string[]; subFolders: string[] };
export type FoldersList = [string, FolderData2][];
export type FileData = ReturnType<typeof getRelevantFileData>;
export type FolderData2 = {
  updatedAt: string;
  id: string;
  name: string;
  path: string[];
  subFolders: string[];
  parentFolderId: string | null;
};

export type SingleFileData = FileData;
