"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { File as File_, Clock, DownloadCloud, ExternalLink, SaveAll, Delete } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UploadStatus } from "../types";
import { MailAttachment } from "../../_indexed/schemas";
import { useAttachmentSelected, useAttachmentsStore, useMailData } from "../../_stores/attachments_stores/useAttachmentsStore";
import { useShallow } from "zustand/react/shallow";
import { useAttachmentsAsyncStore } from "../../_stores/attachments_stores/useAttachmentsAsyncStore";
import { deleteAttachment } from "../../_stores/attachments_stores/globalFunctions";
import { Input } from "@/components/ui/input";
import { saveAttachmentToDrive } from "../../_utils/_files/save_file";
import { useFoldersMapStore } from "../../_stores/_documents_stores/foldersStores";
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
      {/* <ThemeSelector /> */}
      {/* <Card>asdss</Card> */}
      {/* <GenericModelContainer className="flex flex-col h-[90%] w-full" md={md} setMd={setMd} /> */}
      <div className="flex flex-wrap gap-4 ">
        {attachments?.map((mail) => {
          // const stat = uploads.get(mail?.id);
          return (
            <Card className={`relative w-72 h-96`} key={mail.id}>
              {/* <div>{mail.meta.valueDate}</div> */}
              {/* <span>{mail.meta.fileName}</span> */}

              {/* <FileMetaData fileName={mail.meta.fileName} /> */}
              <FileView props={mail} />
              <AttachmentActionsBar
                uploadFileToDrive={() => uploadFileToDrive(mail.id)}
                setView={() => setViewComp(mail.dataUrl)}
                data={mail.meta}
                id_={mail.id}
              />

              {/* <UploadProgressBar progress={stat?.progress ?? 0} status={stat?.status ?? "waiting"} uploadStart={() => {}} /> */}
            </Card>
          );
        })}
      </div>
    </>
  );
};

const FileMetaData = ({ fileName }: { fileName: string }) => {
  return (
    <div
      className={` absolute top-0   flex justify-start items-center   bg-slate-300/30 dark:bg-slate-900/60  p-3 w-full   bg-le  justify-between     `}
    >
      <File_ className={`text-sky-600 w-1/12  font-bold`} size={14} />

      <div className={`flex   overflow-clip  w-10/12 px-1   text-start  text-xs  text-nowrap`}>{fileName}</div>
    </div>
    // </div>
  );
};
const attCardStyle_ = { size: 16, btn: "" };

const FromView = ({ email, name }: { email: string; name: string }) => {
  return <div className={`w-3/5 overflow-clip text-nowrap`}>{email}</div>;
};
const formatDate = (v: string | number) => {
  // return v;
  const date = new Date(Number(v));
  const d = date.getDay();
  const m = date.getMonth();
  const y = date.getFullYear();
  return { d, m, y };
};

const DateView = ({ ts }: { ts: number }) => {
  const d = formatDate(ts);
  return (
    <div className={`flex flex-row-reverse`}>
      <span>{d.d}</span>/<span>{d.m}</span>/<span>{d.y}</span>
    </div>
  );
};
const TimeStemp = ({ ts, vd }: { ts: number; vd: number }) => {
  // const valueDate =
  console.log("dates client:", { ts, vd });
  const folderNamesMap = useFoldersMapStore.getState().folderIdToNameMap;
  const fd = formatDate(vd);
  return (
    <div className={`flex text-xs gap-2`}>
      <Clock size={14} />
      <div className="bg-pink-400">
        <DateView ts={ts} />
      </div>
      <div className={`bg-orange-400`}>
        <DateView ts={vd} />
      </div>
      <div>{folderNamesMap.get(`${fd.y}/${fd.m}`)}</div>
    </div>
  );
};
const AttachmentActionsBar = ({
  data,
  setView,
  id_,
  uploadFileToDrive,
}: {
  data: MailAttachment["meta"];
  setView: () => void;
  id_: string;
  uploadFileToDrive: (id: string) => void;
}) => {
  const meta = useMailData(data.mailId);
  // console.log({ data: data.fileName, meta });
  const setSelectedAttachments = useAttachmentsStore().setSelectedAttachments;
  const enabled = useAttachmentSelected(id_);
  // console.log({ metaData: meta, data });
  return (
    <div className={` absolute bg-slate-300/30 dark:bg-slate-900/50  p-1 flex flex-col bg-le  justify-between bottom-0 w-full h-20   `}>
      {/* {JSON.stringify(meta)} */}
      {/* <div>{meta?.snippet}</div> */}
      <div className={`flex flex-col font-bold p-1 w-full`}>
        <div className={`flex w-full justify-between text-sm px-1`}>
          <FromView email={meta?.fromEmail ?? ""} name={meta?.fromName ?? ""} />
          <TimeStemp ts={data?.createdAt ?? 0} vd={data.valueDate} />
        </div>
      </div>
      <div className={`flex items-center  max-h-8  justify-between px-1`}>
        <div>
          <Input type="checkbox" onChange={() => setSelectedAttachments(id_)} className={` w-4 h-4 border-[1px] `} checked={enabled} />
        </div>
        <div className={`flex gap-[1px] items-center`}>
          <Button onPointerDown={setView} className={`${attCardStyle_.btn} `} variant={"link"}>
            <ExternalLink size={attCardStyle_.size} />
          </Button>
          <Button onPointerDown={() => uploadFileToDrive(id_)} className={`${attCardStyle_.btn} `} variant={"link"}>
            <DownloadCloud size={attCardStyle_.size} />
          </Button>
          <Button onPointerDown={() => deleteAttachment(id_)} className={`${attCardStyle_.btn} `} variant={"link"}>
            <Delete size={attCardStyle_.size} />
          </Button>
        </div>
      </div>
    </div>
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
