import { useState, useEffect, useRef } from "react";
import {
  File as File_,
  Clock,
  Loader,
  DownloadCloud,
  ExternalLink,
  SaveAll,
  Delete,
  Link,
  FolderOpenDotIcon,
  FolderOpen,
} from "lucide-react";

import { MailAttachment } from "../../../_doco/_indexed/schemas";
import { setAttachmentDataUrl } from "../../../_doco/_stores/attachments_stores/useAttachmentsAsyncStore";
import { Button } from "@/components/ui/button";
import { getCachedDataUrl, loadUrlToDataUrlClient } from "../_utils/file_view_utils";
import { useAttachmentSelected, useAttachmentsStore, useMailData } from "../../../_doco/_stores/attachments_stores/useAttachmentsStore";
import { useFoldersMapStore } from "../../../_doco/_stores/_documents_stores/foldersStores";
import { deleteAttachment } from "../../../_doco/_stores/attachments_stores/globalFunctions";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./DatePickerWithPresets";

export const FileView = ({
  attachment,
  setViewComp,
  uploadFileToDrive,
}: {
  attachment: MailAttachment;
  setViewComp: (v: string) => void;
  uploadFileToDrive: (id: string) => void;
}) => {
  const [fileUrl, setFileUrl] = useState(() => "");
  const [fileLinkUrl, setFileLink] = useState("");

  // const urls = useAttachmentsStore(useShallow((state) => state.urls));
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("File view useEffect 333: ");
    // const existingUrl = urls.get(id_);
    if (attachment.dataUrl) {
      console.log("got data url");
      setFileUrl(attachment.dataUrl);
      return;
    }
    if (attachment.linkUrl) {
      setFileLink(attachment.linkUrl);
      return;
    }

    getCachedDataUrl(attachment.base64String, attachment.meta.fileName, attachment.meta.mimeType).then((data) => {
      console.log({ url_cach_function: data });
      const [error, url] = data;
      if (error) {
        setError(error.message);
        return;
      }
      if (attachment.meta.mimeType === `application/octet-stream`) {
        setAttachmentDataUrl({ type: "link", id: attachment.id, data: url });
        setFileLink(url);
      } else {
        setAttachmentDataUrl({ type: "url", id: attachment.id, data: url });
        setFileUrl(url);
      }
      // urls.set(id_, url);
    });
  }, []);

  if (!fileUrl && !fileLinkUrl) return <Loader size={40} className={`animate-spin duration-3000`} />;
  if (fileLinkUrl)
    return (
      <FileLink
        id_={attachment.id}
        fileLinkUrl={fileLinkUrl}
        meta={attachment.meta}
        setUrlCallback={(url) => {
          setFileUrl(url);
          setFileLink("");
        }}
      />
    );
  // console.log({ id_, fileUrl });
  return (
    <div className=" flex flex-col h-full overflow-clip border-pink-50">
      <PreviewIframe src={fileUrl ?? ""} />;
      <AttachmentActionsBar
        uploadFileToDrive={() => uploadFileToDrive(attachment.id ?? "")}
        setView={() => setViewComp(attachment.dataUrl ?? "")}
        data={attachment.meta}
        id_={attachment.id}
      />
    </div>
  );
};
const formatDate = (v: string | number) => {
  // return v;
  const date = new Date(Number(v));
  const d = date.getDay();
  const m = date.getMonth();
  const y = date.getFullYear();
  return { d, m, y };
};

const attCardStyle_ = { size: 16, btn: "" };

const FromView = ({ email, name }: { email: string; name: string }) => {
  return <div className={`w-3/5 overflow-clip text-nowrap`}>{email}</div>;
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
  const dateRef = useRef<Date>(new Date(data.valueDate));
  // console.log({ data: data.fileName, meta });
  const setSelectedAttachments = useAttachmentsStore().setSelectedAttachments;
  const enabled = useAttachmentSelected(id_);
  // console.log({ metaData: meta, data });

  const folderNamesMap = useFoldersMapStore.getState().folderIdToNameMap;
  //   const fd = formatDate(vd);

  const folderId = folderNamesMap.get(`${dateRef.current.getFullYear()}/${dateRef.current.getMonth()}`);
  return (
    <div className={` absolute bg-slate-300/30 dark:bg-slate-900/50   flex flex-col bg-le  justify-between bottom-0 w-full h-20   `}>
      {/* {JSON.stringify(meta)} */}
      {/* <div>{meta?.snippet}</div> */}
      <div className={`flex flex-col font-bold  w-full`}>
        <div className={`flex w-full items-center justify-between text-sm `}>
          {/* <FromView email={meta?.fromEmail ?? ""} name={meta?.fromName ?? ""} /> */}
          <div className={`flex w-1/2`}>
            <DatePicker initial={dateRef.current} cb={(d) => (dateRef.current = d)} />
          </div>
          {/* <TimeStemp ts={data?.createdAt ?? 0} vd={data.valueDate} cb={(d) => (dateRef.current = d)} /> */}
          {folderId ? <FolderOpenDotIcon size={18} /> : <FolderOpen size={18} />}
        </div>
      </div>
      <div className={`  px-2   flex justify-start items-center   bg-slate-300/30 dark:bg-slate-900/60   w-full   bg-le       `}>
        <File_ className={`text-sky-600 w-1/12  font-bold`} size={18} />

        <div className={`flex   overflow-clip  w-10/12 px-1   text-start  text-xs  text-nowrap`}>{data.fileName}</div>
      </div>
      <div className={`flex items-center    justify-between pt-2 border-t-4 border-slate-400/50 `}>
        <div className="pr-3">
          <Input
            type="checkbox"
            onChange={() => setSelectedAttachments(id_)}
            className={` w-[14px] h-[14px] border-[1px] `}
            checked={enabled}
          />
        </div>
        <div className={`flex gap-[1px] items-center`}>
          <Button onPointerDown={setView} className={`${attCardStyle_.btn}  p-0`} variant={"link"}>
            <ExternalLink size={attCardStyle_.size} />
          </Button>
          {/* <Button onPointerDown={() => uploadFileToDrive(id_)} className={`${attCardStyle_.btn} `} variant={"link"}>
            <DownloadCloud size={attCardStyle_.size} />
          </Button> */}
          <Button onPointerDown={() => deleteAttachment(id_)} className={`${attCardStyle_.btn}  p-0`} variant={"link"}>
            <Delete size={attCardStyle_.size} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const FileLink = ({
  fileLinkUrl,
  meta,

  setUrlCallback,
  id_,
}: {
  fileLinkUrl: string;

  meta: MailAttachment["meta"];

  setUrlCallback: (url: string) => void;
  id_: string;
}) => {
  const [loading, setLoading] = useState(false);
  const mail = useMailData(meta.mailId);

  return (
    <div className={` flex flex-col   justify-between p-4  w-full h-full`}>
      <h2 className={`border-b-2 p-1 font-bold`}>קישור להורדה</h2>
      <div className={`flex flex-col  h-1/4 overflow-clip border-b-2 border-slate-400/50 `}>
        <span>נושא</span>

        <p className={`overflow-scroll opacity-75 `}>{mail?.subject}</p>
      </div>
      <div className={`flex flex-col h-1/2 overflow-clip border-b-2 border-slate-400/50 `}>
        <span>תוכן</span>

        <p className={`overflow-scroll opacity-75 `}>{mail?.snippet}</p>
      </div>
      {/* {JSON.stringify(meta)} */}
      <div
        className={`  top-0   flex justify-start items-center   bg-slate-300/30 dark:bg-slate-900/60  p-3 w-full   bg-le  justify-between     `}
      >
        <File_ className={`text-sky-600 w-1/12  font-bold`} size={14} />

        <div className={`flex   overflow-clip  w-10/12 px-1   text-start  text-xs  text-nowrap`}>{meta.fileName}</div>
      </div>
      <Button
        className={"py-6 gap-4"}
        onPointerDown={async () => {
          setLoading(true);
          // createDataUrlFromLink(fileLinkUrl, fileName)
          loadUrlToDataUrlClient(fileLinkUrl)
            .then(([error, data]) => {
              // console.log("cached_data_url:", { error, url });
              if (!error) {
                const { base64, dataUrl, mimeType } = data;
                setAttachmentDataUrl({ type: "data", id: id_, data: base64, dataUrl: dataUrl, mimeType });
                setUrlCallback(dataUrl);
              }
            })
            .finally(() => setLoading(false));
        }}
      >
        <span>הורד</span>
        <Link />
      </Button>
    </div>
  );
};

const PreviewIframe = ({ src }: { src: string }) => (
  <iframe
    src={src}
    // alt={attachment.fileName}
    className=" w-full h-full overflow-auto"
  />
);

// const DateView = ({ ts }: { ts: number }) => {
//   const d = formatDate(ts);
//   return (
//     <div className={`flex flex-row-reverse`}>
//       <span>{d.d}</span>/<span>{d.m}</span>/<span>{d.y}</span>
//     </div>
//   );
// };
// const TimeStemp = ({ ts, vd, cb }: { ts: number; vd: number; cb: (d: Date) => void }) => {
//   // const valueDate =
//   console.log("dates client:", { ts, vd });
//   const folderNamesMap = useFoldersMapStore.getState().folderIdToNameMap;
//   const fd = formatDate(vd);

//   const folderId = folderNamesMap.get(`${fd.y}/${fd.m}`);
//   return (
//     <div className={`flex text-xs gap-2`}>

//       {/* <Clock size={14} />
//       <div className="bg-pink-400">
//         <DateView ts={ts} />
//       </div>
//       <div className={`bg-orange-400`}>
//         <DateView ts={vd} />
//         </div>
//         <div>{}</div> */}
//     </div>
//   );
// };
