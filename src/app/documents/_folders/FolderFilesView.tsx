"use client";
import { useSelectedFolder, useSelectedFolderId } from "../../../_doco/SessionCache";
import { useMutation, useQuery } from "@tanstack/react-query";
import { File, DownloadCloud, ExternalLink, Loader, Loader2, X, Clock, LockKeyhole, LockKeyholeOpen, Delete } from "lucide-react";
import { listFilesInFolder } from "../../../_doco/_utils/_folders/foldersUtils";

import { useDocumentsStore } from "../../../_doco/_stores/_documents_stores/useDocumentsStore";
import { FileData } from "../../../_doco/_utils/save_file_utils/types";

import { useAttachmentsStore } from "../../../_doco/_stores/attachments_stores/useAttachmentsStore";

import { FileComponent } from "../_components/FileComponent";
import { gridStyle_ } from "./FoldersNavigation";

export function FolderFilesView() {
  const { files, error, isLoading } = useFolderFilesData();
  const setMd = useAttachmentsStore((state) => state.setMd);
  console.log({ files });
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (isLoading) return <Loader className={`animate-spin duration-3000`} />;
  if (!files) return <div>אין קבצים...</div>;
  return (
    <>
      <div className={gridStyle_}>
        {files?.map((file) => (
          <FileComponent key={file.fileId} file={file} />
        ))}
      </div>
    </>
  );
}
// https://drive.google.com/file/d/1vIuAYoKVYzHlsKe-GsN_5Excbtjda-Ls/view?usp=drivesdk

const PUBLIC_PREM = "anyoneWithLink";
const getNeededPermissions = (files: FileData[]) => {
  let notPermited: string[] = [];
  let permited: string[] = [];
  for (const f of files) {
    if (!f.fileId) continue;
    if (!f.permissionIds?.find((v) => v === PUBLIC_PREM)) notPermited.push(f.fileId);
    else permited.push(f.fileId);
  }
  console.log("permissions statuses:", { permited, notPermited });
  return { permited, notPermited };
};
const useFolderFilesData = () => {
  const folder = useSelectedFolder();
  console.log({ selectedFolder: folder });
  const {
    data: files,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["folder_files", folder?.id ?? ""],
    queryFn: () =>
      listFilesInFolder(folder?.id ?? "", folder?.updatedAt ?? "").then((data) => {
        const { notPermited, permited } = getNeededPermissions(data);

        if (notPermited.length || permited.length) {
          // const existsNotPerm = useDocumentsStore.getState().notPermited;
          // const existsPerm = useDocumentsStore.getState().permited;
          const existsNotPerm: string[] = [];
          const existsPerm: string[] = [];
          useDocumentsStore.setState({
            notPermited: Array.from(new Set([...existsNotPerm, ...notPermited])),
            permited: Array.from(new Set([...existsPerm, ...permited])),
          });
        }
        console.log({ foldersData: data, folder });
        return data;
      }),
    enabled: !!(folder?.id && folder.updatedAt),
  });

  return { files, error, isLoading };
};

{
  /* {perm === "UPDATING" ? (
        <div className={`flex w-full h-full justify-center items-center`}>
          <Loader2 size={40} className={`animate-spin duration-2000`} />
        </div>
      ) : perm === "OK" ? (
        file.thumbnailLink && <img src={processThumbnailUrl(file.thumbnailLink)} />
      ) : (
        // <iframe src={previewUrl ?? ""} className={`w-full h-full`} />
        <FileForbidden f={file} />
      )} */
}
