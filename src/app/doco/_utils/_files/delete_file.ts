import { getDriveClient } from "../../_google/clients";

export const deleteFile = async (fileId: string) => {
  const drive = await getDriveClient();
  return drive.files
    .delete({ fileId })
    .then((res) => res.status === 204)
    .catch((delete_drive_file_error) => {
      console.log({ delete_drive_file_error });
      return false;
    });
};
