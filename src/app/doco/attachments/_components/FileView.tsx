import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

import { MailAttachment } from "../../_indexed/schemas";
import { setAttachmentDataUrl } from "../../_stores/attachments_stores/useAttachmentsAsyncStore";
import { Button } from "@/components/ui/button";
import { createDataUrlFromLink, getCachedDataUrl, loadUrlToDataUrlClient } from "../_utils/file_view_utils";

export const FileView = ({ attachment }: { attachment: MailAttachment }) => {
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
        fileName={attachment.meta.fileName}
        fileLinkUrl={fileLinkUrl}
        id_={attachment.id}
        setUrlCallback={(url) => {
          setFileUrl(url);
          setFileLink("");
        }}
      />
    );
  // console.log({ id_, fileUrl });
  return <PreviewIframe src={fileUrl ?? ""} />;
};

const FileLink = ({
  fileLinkUrl,
  id_,
  fileName,
  setUrlCallback,
}: {
  fileLinkUrl: string;
  id_: string;
  fileName: string;
  setUrlCallback: (url: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <div className={`flex flex-col justify-center  bg-pink-400 w-full h-full`}>
      <Button
        className={"border-4"}
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
        הורד
      </Button>
    </div>
  );
};

const PreviewIframe = ({ src }: { src: string }) => (
  <iframe
    src={src}
    // alt={attachment.fileName}
    className="absolute max-w-full h-full overflow-auto"
  />
);
