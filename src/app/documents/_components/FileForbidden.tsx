import { AlertCircle, Loader2 } from "lucide-react";
import { SingleFileData } from "../../../_doco/_utils/save_file_utils/types";
import { Button } from "@/components/ui/button";
import { setFilePermissionSingle } from "../../../_doco/_utils/_files/permissions";
import { useMutation } from "@tanstack/react-query";

export const FileForbidden = ({ f }: { f: SingleFileData }) => {
  const permMut = useMutation({ mutationFn: (id: string) => setFilePermissionSingle(id) });
  return (
    <div className={`flex flex-col justify-between w-full h-full p-2 py-5 gap-2`}>
      <div className={`flex w-full justify-center items-center gap-2`}>
        <span className={`opacity-75`}>לא מורשה</span>

        {permMut.isPending ? <Loader2 size={32} className={`animate-spin dura`} /> : <AlertCircle size={32} className={`text-red-500`} />}
      </div>

      <span className={`max-h-20  text-sm overflow-hidden`}>{f.fileName}</span>
      <Button
        disabled={!f.fileId}
        onPointerDown={() => {
          if (!f.fileId) return;
          permMut.mutate(f.fileId);
        }}
      >
        בקש הרשאה
      </Button>
    </div>
  );
};
