"use server";

import { listFilesInFolder } from "../_folders/foldersUtils";
import { FileData, FolderData2 } from "../save_file_utils/types";
export const getAllFiles = async (folders: [string, FolderData2][]) => {
  //   const drive = await getDriveClient();
  const requests: Promise<FileData[]>[] = [];
  for (let i = 0; i < folders.length; i++) {
    requests.push(listFilesInFolder(folders[i][0], folders[i][1].updatedAt));
  }

  const results = await Promise.all(requests);
  const files: FileData[] = [];
  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    for (let j = 0; j < res.length; j++)
      // console.log({ returned_files: res });
      files.push(res[j]);
  }

  // Fetch the base folder metadata
  console.log({ getAllFiles: files });
  return files;
};
