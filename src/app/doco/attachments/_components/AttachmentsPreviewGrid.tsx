"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SaveAll } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UploadStatus } from "../types";
import { useAttachmentsStore } from "../../_stores/attachments_stores/useAttachmentsStore";
import { useShallow } from "zustand/react/shallow";
import { useAttachmentsAsyncStore } from "../../_stores/attachments_stores/useAttachmentsAsyncStore";
import { saveAttachmentToDrive } from "../../_utils/_files/save_file";
import { FileView } from "./FileView";
// import { decodeBase64 } from "../_utils/utils";

// export const dynamic = "force-static";
// import { setInitialData } from "../../_indexed/storageUtils";

// type InitialData = { attachments: MailAttachment[]; mails: MailMeta[] };

export const AttachmentsPreviewGrid = () => {
  // useInitialDataSync(data);
  // const attachments = useAttachmentsAsyncStore(useShallow((state) => state.attachments));
  // const attachments = useAttachmentsStore(useShallow((state) => state.attachments));
  const attachments = useAttachmentsAsyncStore((state) => state.attachments);
  // const { uploads } = useStoredAttachments();
  const setMd = useAttachmentsStore(useShallow((state) => state.setMd));
  // const urls = useAttachmentsStore(useShallow((state) => state.urls));
  const uploadFileToDrive = (id: string) => {
    const file = attachments.filter((f) => f.id === id)[0];
    if (file) {
      const { base64String, id, meta } = file;
      const dataUrl = attachments.filter((at) => at.id === id)[0].dataUrl;
      // urls.get(id);
      if (!dataUrl) return;
      saveAttachmentToDrive({
        data: base64String,
        filename: meta.fileName,
        folderId: "",
        fileId: "",

        size: meta.size,
      });
    }
  };
  const setViewComp = (url: string | null) => {
    if (!url) return;
    setMd({
      css: "h-[95%] w-full",
      content: (
        <div className={`flex w-full h-full`}>
          <iframe className={`min-h-full w-full`} src={url} />
        </div>
      ),
    });
  };

  // const getDD = createOrGetFolderPath(["2024", monthsMa]);
  console.log({ attachments_grid: attachments });
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5 2xl:grid-cols-6   gap-4  ">
        {attachments?.map((attachment) => {
          // const stat = uploads.get(mail?.id);
          return (
            <Card className={`relative w-72 2xl:w-80 h-96  p-2`} key={attachment.id}>
              <FileView attachment={attachment} setViewComp={setViewComp} uploadFileToDrive={uploadFileToDrive} />
            </Card>
          );
        })}
      </div>
    </>
  );
};

// const FileView = ({ file }: { file: FileAttachment }) => {
//   const getMimeType = (mimeType: string): string => {
//     if (mimeType.startsWith("image/")) return "image";
//     if (mimeType === "application/pdf") return "pdf";
//     return "unknown";
//   };

//   const getFileUrl = (mimeType: string, data: string): string => {
//     if (mimeType.startsWith("image/")) {
//       return `data:${mimeType};base64,${data}`;
//     }
//     if (mimeType === "application/pdf") {
//       return `data:${mimeType};base64,${data}`;
//     }
//     return "";
//   };

//   const fileCategory = getMimeType(file.mimeType);
//   const fileUrl = getFileUrl(file.mimeType, file.data);

//   return (
//     <div className="file-viewer">
//       {fileCategory === "image" && <img src={fileUrl} alt={file.fileName} className="max-w-full h-auto" />}
//       {fileCategory === "pdf" && <embed type="application/pdf" src={fileUrl} className="w-full h-[500px]" />}
//       {fileCategory === "unknown" && (
//         <div className="text-center p-4">
//           <p>Unsupported file type: {file.mimeType}</p>
//         </div>
//       )}
//     </div>
//   );
// };
const UploadProgressBar = ({ progress, status, uploadStart }: { progress: number; status: UploadStatus; uploadStart: () => void }) => {
  if (!status) return null;
  if (status === "waiting")
    return (
      <Button onPointerDown={uploadStart}>
        <span>שמור</span>
        <SaveAll />
      </Button>
    );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{Math.round(progress ?? 0)}% הושלם</span>
      </div>
      <Progress value={progress ?? 0} className="w-full" />
    </div>
  );
};
// type SetUploadsState = React.Dispatch<
//   React.SetStateAction<
//     Map<
//       string,
//       {
//         progress: number;
//         status: "waiting" | "started" | "finished";
//       }
//     >
//   >
// >;
