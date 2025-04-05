"use client";
import { Button } from "@/components/ui/button";
import { RefreshCcwDot, SaveAll } from "lucide-react";
import { useState } from "react";
import { useAttachmentsStore } from "../../../../_doco/_stores/attachments_stores/useAttachmentsStore";
import { useShallow } from "zustand/react/shallow";
import { docoStyle_ } from "../../types";
import { useAttachmentsAsyncStore } from "../../../../_doco/_stores/attachments_stores/useAttachmentsAsyncStore";
import { saveAttachmentToDrive } from "../../../../_doco/_utils/_files/save_file";

export const AttachmentsActionsButtons = () => {
  return (
    <>
      <UploadAttachmentsButton />
      <ClearAttachmentsButton />
    </>
  );
};

export const UploadAttachmentsButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attachments = useAttachmentsAsyncStore(useShallow((state) => state.attachments));
  const mailsData = useAttachmentsStore(useShallow((state) => state.mailsData));
  // const setDocuments = useDocumentsStore().;
  const handleFileUpload = async () => {
    setLoading(true);
    setError(null);

    try {
      // const uploadPromises = attachments.map((att) => {
      //   return saveAttachmentToDrive({});
      // });
      // const uploaded = (await Promise.all(uploadPromises)).filter((u) => u !== undefined);
      // const date_ = new Date().getTime();
      // const savedStatuses: DocoDocument[] = uploaded.map((u) => {
      //   const mData = mailsData.get(u.fileId??"");
      //   // if(!mData) return
      //   return {
      //     id: mData?.id ?? "",
      //     // snippet: mData?.snippet ?? "",
      //     // subject: mData?.subject ?? "",
      //   //  folderId:
      //     // fromName: mData?.fromName ?? "",
      //     // isValid: !!mData?.isValid,
      //     // fromEmail: mData?.fromEmail ?? "",
      //     // innerDate: mData?.internalDate ?? "",
      //     // createdAt: date_,
      //     // updatedAt: date_,
      //     // mailId: u.,
      //     // url: u.webViewLink ?? "",
      //   };
      // });
      // setDocuments(savedStatuses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
      //   setUploads(new Map());
    }
  };

  return (
    <Button
      onPointerDown={handleFileUpload}
      disabled={loading || attachments.length === 0}
      className={docoStyle_.btn.css}
      variant={docoStyle_.vari}
    >
      <span>שמור</span>
      <SaveAll size={docoStyle_.btn.size} />
    </Button>
  );
};

export const ClearAttachmentsButton = () => {
  const [loading, setLoading] = useState(false);
  const attachments = useAttachmentsAsyncStore(useShallow((state) => state.attachments));
  const clearAttachments = useAttachmentsAsyncStore().clearAttachments;
  return (
    <Button
      onPointerDown={() => clearAttachments()}
      disabled={loading || attachments.length === 0}
      className={docoStyle_.btn.css}
      variant={docoStyle_.vari}
    >
      <span>נקה</span>
      <RefreshCcwDot size={docoStyle_.btn.size} />

      {/* <span> {attachments.length}</span> */}
    </Button>
  );
};
