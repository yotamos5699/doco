import { useMutation } from "@tanstack/react-query";
import { removePermissions, setFilePermissionSingle } from "../../../_doco/_utils/_files/permissions";
import { usePermStatus } from "../../../_doco/_stores/_documents_stores/useDocumentsStore";
import { CbInput } from "@/components/ui/input";
import { FileMoreMenu } from "./FileMoreMenu";
import { Button } from "@/components/ui/button";
import { Delete, DownloadCloud, ExternalLink, Loader2, LockKeyhole, LockKeyholeOpen } from "lucide-react";

export const FileActions = ({
  fileId,
  downloadFile,
  viewFile,
}: {
  fileId?: string | null;
  downloadFile: () => void;
  viewFile: () => void;
}) => {
  const removePermMut = useMutation({ mutationFn: (id: string) => removePermissions([id]) });
  const setPermMut = useMutation({ mutationFn: (id: string) => setFilePermissionSingle(id) });
  const perm = usePermStatus(fileId ?? "");
  const togglePermission = () => {
    if (!fileId) return;
    switch (perm) {
      case "OK":
        return removePermMut.mutate(fileId);
      case "FORBIDDEN":
        return setPermMut.mutate(fileId);
    }
  };

  return (
    <div className={`absolute bottom-0 p-2 bg-slate-300/30 dark:bg-slate-900/60  flex w-full items-center  max-h-8  justify-between `}>
      <div>
        <CbInput checked={true} onChange={(e) => {}} />
      </div>
      <FileMoreMenu
        nodes={[
          <Button className={`flex w-full justify-between`} onPointerDown={viewFile} variant={"link"}>
            <div className={`text-xs `}>צפה בקובץ</div>
            <ExternalLink />
          </Button>,

          <Button onPointerDown={downloadFile} className={`flex w-full justify-between`} variant={"link"}>
            <div className={`text-xs `}>הורד</div>
            <DownloadCloud />
          </Button>,

          <Button className={`flex w-full  justify-between`} onPointerDown={togglePermission} variant={"link"}>
            {perm === "UPDATING" ? (
              <Loader2 className={`animate-spin duration-2000`} />
            ) : perm === "FORBIDDEN" ? (
              <>
                <div className={`text-xs `}>פתח גישה</div>
                <LockKeyhole />
              </>
            ) : (
              <>
                <div className={`text-xs `}>סגור גישה</div>
                <LockKeyholeOpen />
              </>
            )}
          </Button>,
          <Button className={`flex w-full justify-between`} variant={"link"}>
            <div className={`text-xs `}>מחק קובץ</div>
            <Delete />
          </Button>,
        ]}
      />
    </div>
  );
};
