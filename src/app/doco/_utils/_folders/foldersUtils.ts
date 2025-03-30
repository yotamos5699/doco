"use server";
import { getDriveClient } from "../../_google/clients";
import { cache } from "react";
import { FileData, FolderData, FolderData2 } from "../save_file_utils/types";
import { FileFieldsString, getRelevantFileData } from "../factories";
import { drive_v3 } from "googleapis";
export const getCachedBaseFolderId = cache(async (name: string = "doco_files") => {
  console.log("getCachedBaseFolderId", { name });
  return (await constractFolder("root", name))?.id ?? "root";
});

export async function createOrGetFolderPath(folderPath: string[], parentId?: string): Promise<FolderData2 | null> {
  let path: string[] = [];

  const rootId = await getCachedBaseFolderId();
  path.push(rootId);
  if (parentId) path.push(parentId);

  const baseFolder = parentId ?? rootId;

  let folder: drive_v3.Schema$File | null = null;
  try {
    let currentFolderId = baseFolder;

    for (const folderName of folderPath) {
      folder = await createOrGetFolderId(folderName, currentFolderId);
      if (folder && folder.id) {
        currentFolderId = folder.id;
      }
    }

    if (!folder) return null;
    const { id, parents, name } = folder;
    path.push(id ?? "");
    return {
      id: id ?? "",
      path,
      name: name ?? "",
      parentFolderId: folder?.parents ? folder.parents[0] : "",
      subFolders: [],
      updatedAt: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    throw error;
  }
}

async function constractFolder(parentFolderId: string, folderName: string) {
  const drive = await getDriveClient();

  try {
    const response = await drive.files.list({
      q: `'${parentFolderId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id,name)",
    });
    // console.log({ response });
    console.log({ response });
    const folder = response.data.files?.[0];
    if (folder) {
      return folder;

      // .id ?? parentFolderId;
    }

    // If folder doesn't exist, create it
    const folderResponse = await drive?.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentFolderId],
      },
      fields: "id,name",
    });

    return folderResponse?.data;
    // .id;
  } catch (error_first: any) {
    // const res_data = error_first?.response!;
    // console.log({ error_first, res: res_data as string });
    return null;
  }
}

async function createOrGetFolderId(folderName: string, parentFolderId?: string) {
  console.log("createOrGetFolderId", { folderName, parentFolderId });
  console.log("post drive initiation");

  const parentFolderId_ = parentFolderId ?? (await getCachedBaseFolderId());
  // if (parentFolderId) return parentFolderId;
  try {
    const folderResponse = await constractFolder(parentFolderId_, folderName);
    console.log("in try/cactch start");

    // First try to find the folder

    return folderResponse;
    // parentFolderId_;
  } catch (error) {
    throw error;
  }
}

export const getFolderModified = async (id: string) => {
  const drive = await getDriveClient();

  return await drive.files
    .get({
      fileId: id,
      fields: "modifiedTime",
    })
    .then((data) => data.data.modifiedTime);
};
export const getFileModified = async (id: string) => {
  const drive = await getDriveClient();

  return await drive.files
    .get({
      fileId: id,
      fields: "modifiedTime",
    })
    .then((d) => d.data.modifiedTime);
};
const fields =
  "id,permissions,permissionIds, createdTime,properties, name,exportLinks,description, webViewLink, webContentLink, properties, appProperties ";

export const updateFileProperties = async (fileId: string | null | undefined, properties: Record<string, string>) => {
  const drive = await getDriveClient();

  if (!fileId) return null;
  return await drive.files.update({
    fileId: fileId,
    requestBody: { properties },
    fields: FileFieldsString, // Retrieve updated fields
  });

  // console.log("Updated file properties:", response.data);
};
//  Promise<{ files: FileData[]; needsPermission: string[] }>
export const listFilesInFolder = async (folderId: string, updatedAt?: string): Promise<FileData[]> => {
  console.log("new folder fetch: ", { folderId });
  const drive = await getDriveClient();
  let needsPermission: string[] = [];

  // folderMetadata.data.modifiedTime
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
      // fields: "files(*)",
      fields: FileFieldsString,
    });

    if (!response.data.files) return [];
    //  { files: [], needsPermission };

    const files = await Promise.all(
      response.data.files.map(async (file) => {
        // if (
        //   !file?.permissions?.some((p) => p.type === "anyone")
        //   // file.mimeType !== "application/vnd.google-apps.folder"
        // ) {
        //   file.id && needsPermission.push(file.id);
        //   // await getFilePremission([file.id], "reader", "user");

        //   // Wait for permission to apply
        // }

        return getRelevantFileData(file);
      })
    );
    // console.log("getFilesFunctions:", { files, needsPermission });
    return files;
    // { files, needsPermission };
  } catch (error) {
    console.error(
      `Error fetching files for folder ${folderId}:`,
      error
      // ?.response, { res: Object.keys(error) }
    );
    return [];

    // { files: [], needsPermission };
  }
};

// export async function listFoldersInFolder({ folderId }: { folderId: string }): Promise<{
//   folders: Omit<FolderData, "subFolders">[];
//   // files_: any[]
// }> {
//   console.log("getting list of sub folders", { folderId });
//   const drive = await getDriveClient();
//   const folders: Omit<FolderData, "subFolders">[] = [];
//   // const files_: FileData[] = [];

//   const baseFolder = folderId ?? (await getCachedBaseFolderId());
//   // and mimeType = 'application/vnd.google-apps.folder'
//   try {
//     const response = await drive.files
//       .list({
//         q: `'${baseFolder}' in parents and mimeType = 'application/vnd.google-apps.folder  and  trashed = false`,
//         fields: "files(id,name,modifiedTime)",
//         spaces: "drive",
//         pageSize: 100,
//       })
//       .catch((getting_subfolders_error) => console.log({ getting_subfolders_error, res: getting_subfolders_error.response }));

//     const files = response?.data.files;
//     if (!files) return { folders };

//     for (let i = 0; i < files.length; i++) {
//       let file = files[i];
//       // if (file.mimeType === "application/vnd.google-apps.folder")
//       folders.push({
//         id: file.id!,
//         name: file.name!,
//         path: [file.name!],
//         updatedAt: file.modifiedTime ?? "",
//       });
//       // else {
//       // files_.push(getRelevantFileData(file));
//       // }
//     }
//     return {
//       // files_,
//       folders,
//     };
//   } catch (error: any) {
//     console.log({ error, res: error.response, keys: Object.keys(error.response) });
//     throw error;
//   }
// }

// export const getFolders22 = async (baseFolderId: string) => {
//   const drive = await getDriveClient();

//   let allFolders: any[] = [];
//   let queue = [baseFolderId]; // Start with the base folder

//   while (queue.length > 0) {
//     const currentParent = queue.pop(); // Get the next parent folder to process

//     const response = await drive.files.list({
//       q: `'${currentParent}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
//       fields: "files(id, name, parents, modifiedTime)",
//       pageSize: 1000, // Adjust as needed
//     });

//     const folders = response.data.files ?? [];
//     allFolders.push(...folders);

//     // Add nested folders to the queue
//     queue.push(...folders.map((folder) => folder.id ?? ""));
//   }

//   return allFolders;
// };

// // export const getAllFolders = async () => {
//   const drive = await getDriveClient();

//   const response = await drive.files.list({
//     q: `mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
//     fields: "files(id, name, parents, modifiedTime)",
//     pageSize: 1000, // Adjust if needed
//   });
//   return response.data.files ?? [];
// };
// export const getFoldersList = async (baseFolder: string) => {
//   const drive = await getDriveClient();

//   const response = await drive.files.list({
//     q: `'${baseFolder}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
//     fields: "files(id, name, parents, modifiedTime)", // Get required fields
//     pageSize: 1000, // Adjust as needed
//   });

//   const folders = response.data.files ?? [];

//   const folderMap = new Map<string, FolderData2>();

//   folders.forEach((folder) => {
//     const parentId = folder.parents?.[0] || null;
//     if (folder.id)
//       folderMap.set(folder.id, {
//         id: folder.id,
//         name: folder.name ?? "",
//         updatedAt: folder.modifiedTime ?? "",
//         path: [], // This will be populated later
//         subFolders: [],
//         parentFolderId: parentId ?? "",
//       });
//   });

//   // Compute paths and subfolders
//   folders.forEach((folder) => {
//     const parentId = folder.parents?.[0];
//     const folderData = folderMap.get(folder?.id ?? "");

//     if (folderData && parentId) {
//       const parentFolder = folderMap.get(parentId);
//       if (parentFolder) {
//         parentFolder.subFolders.push(folder.id ?? "");
//         folderData.path = [...parentFolder.path, parentFolder.id];
//       }
//     }
//   });

//   const flattenedFolders = Array.from(folderMap.values());
//   return flattenedFolders;
//   console.log(flattenedFolders);
// };
