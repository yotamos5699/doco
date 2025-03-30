import { useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";
import { useAttachmentsAsyncStore } from "../_stores/attachments_stores/useAttachmentsAsyncStore";
import { progressTracker } from "../_utils/_files/progressTracker";
import { UploadStats } from "../attachments/types";

export const useStoredAttachments = () => {
  //   const [files, setFiles] = useState<MailAttachment[]>(() => data);
  const attachments = useAttachmentsAsyncStore(useShallow((state) => state.attachments));
  useEffect(() => {
    // setAttachments(data);
    // db.attachments.toArray().then((d) => setFiles(d));
    const handleProgress = ({ fileId, progress }: { fileId: string; progress: number }) => {
      setUploads((prev) => {
        const next = new Map(prev);
        next.set(fileId, {
          progress,
          status: progress === 0 ? "waiting" : progress === 100 ? "finished" : "started",
        });
        return next;
      });
    };

    progressTracker.on("progress", handleProgress);

    return () => {
      progressTracker.off("progress", handleProgress);
    };
  }, [attachments]);
  const [uploads, setUploads] = useState<UploadStats>(
    () => new Map(attachments.map((att) => [att.id, { progress: 0, status: "waiting" }]))
  );

  return { uploads, setUploads };
};
