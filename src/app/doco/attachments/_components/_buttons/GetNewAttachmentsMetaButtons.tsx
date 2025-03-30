"use client";
import { Button } from "@/components/ui/button";
import { FolderSync, Info, SaveAll, View } from "lucide-react";
import { getNewAttachmentsData, NewAttachmentsData } from "../../_utils/getNewAttachmentsData";
import { useEffect, useState } from "react";
import { useAttachmentsStore } from "../../../_stores/attachments_stores/useAttachmentsStore";
import { useShallow } from "zustand/react/shallow";
import { EmailsMetaPreviewTable } from "../../../_models/EmailsMetaPreviewTable";
import { noMeta, useNoSelections } from "./utils";
import { getNewAttachmentsFiles } from "../../_utils/getNewAttachmentsFiles";
import { AttachmentItem, docoStyle_ } from "../../types";
import { getQueryString } from "../../_utils/utils";
import { useAttachmentsAsyncStore } from "../../../_stores/attachments_stores/useAttachmentsAsyncStore";
import { useAttachmentsMetaStore } from "../../../_stores/attachments_stores/useAttachmentsMetaStore";
import { useFoldersExplorerStore } from "../../../SessionCache";

export const GetNewAttachmentsFilesButtons = () => {
  return (
    <>
      {/* <NewAttachmentsMetaButton /> */}
      <ViewMetaDataButton />
    </>
  );
};

export const NewAttachmentsMetaButton = () => {
  const [loading, setLoading] = useState(false);
  const setMeta = useAttachmentsMetaStore().setMeta;

  return (
    <Button
      onPointerDown={() => {
        setLoading(true);
        getNewAttachmentsData({
          existingList: [...useAttachmentsStore.getState().ids],
          maxResults: useFoldersExplorerStore.getState().maxResults,
          query: getQueryString(),
        })
          .then((data) => setMeta(data))
          .finally(() => setLoading(false));
      }}
      disabled={loading}
      className={docoStyle_.btn.css}
      variant={docoStyle_.vari}
    >
      <span>סנכרן</span>
      <FolderSync size={docoStyle_.btn.size} />
    </Button>
  );
};

const modelStyle_ = "h-[90%]";
export const ViewMetaDataButton = () => {
  const meta = useAttachmentsMetaStore(useShallow((state) => state.meta));
  const setMd = useAttachmentsStore().setMd;
  useEffect(() => {
    if (meta.length) {
      setMd({ css: modelStyle_, title: "מידע על חדשים", content: <EmailsMetaPreviewTable meta={meta} /> });
    }
  }, [meta]);

  return (
    <Button
      onPointerDown={() => setMd({ css: "h-full", title: "מידע על חדשים", content: <EmailsMetaPreviewTable meta={meta} /> })}
      className={docoStyle_.btn.css}
      variant={docoStyle_.vari}
      disabled={noMeta(meta)}
    >
      <span>צפה</span>
      <View size={docoStyle_.btn.size} />
    </Button>
  );
};

export const GetNewAttachmentsFilesButton = () => {
  const [loading, setLoading] = useState(false);

  const meta = useAttachmentsMetaStore(useShallow((state) => state.meta));
  const setAttachmentsAsync = useAttachmentsAsyncStore().setAttachments;
  const noSelection = useNoSelections(meta);
  const setMd = useAttachmentsStore().setMd;
  const clearMeta = useAttachmentsMetaStore().clearMeta;
  // console.log({ noSelection });

  return (
    <Button
      onPointerDown={async () => {
        if (!meta) return;
        setLoading(true);
        const filteredMeta = getFilteredSelectedMeta(meta);

        getNewAttachmentsFiles({ data: filteredMeta }).then((data) => {
          if (!data.error) {
            // setAttachments(data.mailAttachments, true);
            setAttachmentsAsync(data);
            clearMeta();
            setMd(null);
            // setMailsData(data.mailsMeta, true);
          }
        });
      }}
      disabled={loading || noMeta(meta) || noSelection}
      className={`flex px-8s items-center gap-2s `}
    >
      <SaveAll />
      <span>משוך קבצים</span>
    </Button>
  );
};

const getFilteredSelectedMeta = (meta: NewAttachmentsData) => {
  let filteredMeta: NewAttachmentsData = [];
  const selections = useAttachmentsMetaStore.getState().selections;

  for (let i = 0; i < meta.length; i++) {
    let attachments: AttachmentItem[] = [];
    let currentMeta = meta[i];
    if (!selections.has(currentMeta.emailData.id ?? "") || !currentMeta.attachments) continue;

    for (let j = 0; j < currentMeta.attachments.length; j++) {
      const att = currentMeta.attachments[j];
      if (selections.has(att.attachmentId) && !att.exists) {
        attachments.push(currentMeta.attachments[j]);
      }
    }
    if (attachments.length) {
      filteredMeta.push({ emailData: currentMeta.emailData, attachments });
    }
  }
  return filteredMeta;
};
