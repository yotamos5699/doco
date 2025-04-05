import { Card } from "@/components/ui/card";
import { SingleFileData } from "../../../_doco/_utils/save_file_utils/types";
// import { loadUrlToDataUrl } from "../../../../_bin/urlProcessing";
import { getCachedThumbnail, setCachedThumbnail } from "../_utils/linksProcessing";
import { useQuery } from "@tanstack/react-query";
import { FileMetaData } from "./FileMetaData";
import { FileActions } from "./FileActions";
import { downloadFile, viewFile } from "./utils";
import { getThumbNailDataUrl, loadUrlToDataUrlClient } from "../../attachments/_utils/file_view_utils";
export const processThumbnailUrl = (thumbnailLink: string | null | undefined): string => {
  // Remove dimensions parameter if present
  if (!thumbnailLink) return "";
  return thumbnailLink?.replace(/=s\d+/, "=s220");
};
export const FileComponent = ({ file }: { file: SingleFileData }) => {
  console.log({ webViewPermited: file.webViewLink });
  const thumbnailLink = useQuery({
    queryKey: [`file_tn_${file.fileId}`],
    queryFn: () => {
      if (!file.fileId || !file.thumbnailLink) return "";
      const ctn = getCachedThumbnail(file.fileId ?? "");

      if (ctn) {
        console.log("thumbnail cache hit:", { ctn });
        return ctn.data;
      }
      return getThumbNailDataUrl(processThumbnailUrl(file.thumbnailLink))
        .then(([error, data]) => {
          console.log({ thumbNail: { error, data } });
          if (error) {
            console.log({ thumbNailError: error });
            return "";
          }
          setCachedThumbnail(file.fileId ?? "", data);
          return data;
        })
        .catch((err) => {
          console.log({ err });
          return "";
        });
    },
    initialData: file.fileId ? getCachedThumbnail(file.fileId)?.data ?? "" : "",
  });

  // const thumbnailLink = processThumbnailUrl(file.thumbnailLink);
  console.log({ name: file.fileName, thumbnailLink });

  return (
    <Card className={` border-2 flex  flex-col justify-center items-center h-52 w-60 p-2 relative overflow-clip`} key={file.fileId}>
      <FileMetaData fileName={file.fileName ?? ""} />
      {thumbnailLink.data && (
        // <img className={`h-[98%] w-[92%]`} src={thumbnailLink.data} alt="thumbNailUrl" />
        <img className={`h-[98%] w-[92%]`} src={thumbnailLink.data} alt="thumbNailUrl" />
      )}

      <FileActions
        fileId={file.fileId}
        viewFile={() => viewFile(file.webViewLink)}
        downloadFile={() => downloadFile(file.webContentLink)}
      />
    </Card>
  );
};
