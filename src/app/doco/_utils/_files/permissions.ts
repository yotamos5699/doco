"use server";
import { getDriveClient } from "../../_google/clients";
import { AssignedPermission, PremRole, PremType } from "../save_file_utils/types";

const READER_PERM: { role: PremRole; type: PremType } = { role: "reader", type: "anyone" };
const getPermissionType = (fileId: string, perm: AssignedPermission | undefined) => {
  return READER_PERM;
};

export const removePermissions = async (fileIds: string[]) => {
  const drive = await getDriveClient();
  console.log("remove_permissions:", { fileIds });
  const requests: Promise<any>[] = [];
  for (const fileId of fileIds) {
    console.log("fileId_to_remove:", { fileId });
    requests.push(
      drive.permissions // getting drive from goole api already impl
        .delete({ fileId, permissionId: "anyoneWithLink" })
        .then((res) => ({ status: res.status, fileId, error: null }))
        .catch((error) => ({ status: 503, fileId, error: JSON.stringify(error) }))
    );
  }
  return Promise.allSettled(requests);
  // return data;
};
export const setFilePermissionSingle = async (fileId: string, perm?: AssignedPermission) => {
  const drive = await getDriveClient();
  let PERMISSION = getPermissionType(fileId, perm);

  return drive.permissions // getting drive from goole api already impl
    .create({ fileId, requestBody: { ...PERMISSION } })
    .then((res) => ({ status: res.status, fileId, error: null }))
    .catch((error) => ({ status: 503, fileId, error: JSON.stringify(error) }));
};
export const setFilePermissionMulti = async (ids: string[], permTypes?: Record<string, AssignedPermission>) => {
  const drive = await getDriveClient();
  const requests: Promise<any>[] = [];
  for (let i = 0; i < ids.length; i++) {
    let fileId = ids[i];
    let PERMISSION = getPermissionType(fileId, permTypes ? permTypes[fileId] : undefined);

    requests.push(
      drive.permissions // getting drive from goole api already impl
        .create({ fileId, requestBody: { ...PERMISSION } })
        .then((res) => ({ status: res.status, fileId, error: null }))
        .catch((error) => ({ status: 503, fileId, error: JSON.stringify(error) }))
    );
  }

  return await Promise.allSettled(requests);
};
