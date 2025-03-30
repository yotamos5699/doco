"use server";

import { drive_v3 } from "googleapis";
import { getDriveClient } from "../../_google/clients";
import { FolderData2 } from "../save_file_utils/types";

export const getFoldersList = async (baseFolderId: string) => {
  const drive = await getDriveClient();

  let allFolders: drive_v3.Schema$File[] = [];

  // Fetch the base folder metadata
  const baseFolderResponse = await drive.files.get({
    fileId: baseFolderId,
    fields: "id, name, parents, modifiedTime",
  });

  const baseFolder = baseFolderResponse.data;
  if (!baseFolder.id || !baseFolder.name) {
    throw new Error("Base folder not found or missing required fields.");
  }

  allFolders.push(baseFolder); // Include the base folder

  let queue = [baseFolderId];

  while (queue.length > 0) {
    const currentParent = queue.pop();

    const response = await drive.files.list({
      q: `'${currentParent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name, parents, modifiedTime)",
      pageSize: 1000,
    });

    const folders = response.data.files ?? [];
    allFolders.push(...folders);
    queue.push(...folders.map((folder) => folder.id ?? ""));
  }

  return buildFolderStructure(allFolders);
};

const buildFolderStructure = (folders: drive_v3.Schema$File[]): [string, FolderData2][] => {
  const folderMap = new Map<string, FolderData2>();

  folders.forEach((folder) => {
    if (folder.id && folder.name)
      folderMap.set(folder.id, {
        id: folder.id,
        name: folder.name,
        updatedAt: folder.modifiedTime ?? "",
        path: [],
        subFolders: [],
        parentFolderId: folder.parents?.[0] || null,
      });
  });

  const computePath = (folderId: string): string[] => {
    const folder = folderMap.get(folderId);
    if (!folder) return [];

    if (folder.path.length > 0) return folder.path;

    if (folder.parentFolderId) {
      const parentPath = computePath(folder.parentFolderId);
      folder.path = [...parentPath, folder.parentFolderId];
    }

    return folder.path;
  };

  folders.forEach((folder) => {
    const folderData = folderMap.get(folder.id ?? "");
    if (folderData && folderData.parentFolderId && folder.id) {
      const parentFolder = folderMap.get(folderData.parentFolderId);
      if (parentFolder) {
        parentFolder.subFolders.push(folder.id);
      }
    }
    folder.id && computePath(folder.id);
  });

  return Array.from(folderMap.entries());
};
// Usage

//   console.log(mapReadyFolders);
