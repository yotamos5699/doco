"use client";

import { Session } from "next-auth";
import { useEffect } from "react";
import { create } from "zustand";
import { getDocuments } from "./_utils/saveAttachment";
import { useAttachmentsAsyncStore } from "./_stores/attachments_stores/useAttachmentsAsyncStore";
import { useAttachmentsStore } from "./_stores/attachments_stores/useAttachmentsStore";
import { getCachedBaseFolderId } from "./_utils/_folders/foldersUtils";
import { persist, createJSONStorage } from "zustand/middleware";
import { FoldersList, GetLabelsRetType } from "./_utils/save_file_utils/types";
import { getGmailLabelsAndGroups } from "./_utils/save_file_utils/getGmailLabelsAndGroups";
import { useFoldersMapStore } from "./_stores/_documents_stores/foldersStores";
import { getFoldersList } from "./_utils/_folders/getFolders";
import { useQuery } from "@tanstack/react-query";
import { useDocumentsMapStore, useDocumentsStore } from "./_stores/_documents_stores/useDocumentsStore";
import { DateRange } from "react-day-picker";
import { useShallow } from "zustand/react/shallow";
import { useUpperNavData } from "./_hooks/useUpperNavData";
import { useThumbsSync } from "./documents/_utils/linksProcessing";
export const useDocoSessionStore = create<{ session: null | Session }>((set) => ({ session: null }));

export const useSelectedFolderId = () => {
  const cid = useFoldersExplorerStore((state) => state.currentFolderId);
  const baseId = useFoldersExplorerStore((state) => state.baseFolderId);

  return cid ? cid : baseId ?? "";
};
export const useSelectedFolder = () => {
  const folderId = useSelectedFolderId();
  const f = useFoldersMapStore((state) => state.foldersMap);
  console.log({ folder: f, folderId });
  return f.get(folderId);
};
export type Date_Range = { from: number; to: number };
type FoldersStoreProps = {
  currentFolderId: string;
  maxResults: number;
  lastSynced: { range: Date_Range; action: number };
  updateDateRange: (value: DateRange | undefined) => void;
  dateRange: { from: number; to: number };
  setCurrentFolderId: (id: string) => void;
  baseFolderId: string | null;
  labels: GetLabelsRetType;
  setLabels: (lbs: GetLabelsRetType) => void;
  discludedLabels: string[];
  foldersTree: FoldersList;
  setFoldersTree: (ft: FoldersList) => void;
};
export const useFoldersExplorerStore = create<FoldersStoreProps>()(
  persist(
    (set) => ({
      currentFolderId: "",
      maxResults: 10,
      dateRange: { from: 0, to: 0 },
      lastSynced: { range: { from: 0, to: 0 }, action: 0 },
      updateDateRange: (dr) =>
        set(() => ({ dateRange: { from: dr?.from ? dr.from.getTime() / 1000 : 0, to: dr?.to ? dr.to.getTime() / 1000 : 0 } })),
      setCurrentFolderId: (currentFolderId) => set({ currentFolderId }),
      baseFolderId: null,
      labels: [],
      setLabels: (labels) => set({ labels }),
      discludedLabels: [],
      foldersTree: [],
      setFoldersTree: (foldersTree) => set({ foldersTree }),
    }),

    {
      name: "folders_tree_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const usePermsSync = () => {
  const preq = useDocumentsStore((state) => state.notPermited);

  useEffect(() => {
    useDocumentsMapStore.setState({ permNeeded: new Set(preq) });
  }, [preq]);
};
export const SessionCache = ({ session }: { session: Session | null }) => {
  // const setDocuments = useDocumentsStore().setDocuments;
  useUpperNavData();
  usePermsSync();
  useThumbsSync();
  useEffect(() => {
    if (session) {
      getCachedBaseFolderId().then((baseFolderId) => useFoldersExplorerStore.setState({ baseFolderId }));
      console.log("setting initial data ....");
      // getDocuments("documents").then((data) => data.length && setDocuments(data));
      getDocuments("mailsMeta").then(
        (data) => data.length && useAttachmentsAsyncStore.setState({ mailsMapData: data.map((md) => [md.id, md]) })
      );
      getDocuments("attachments").then((attachments) => {
        if (!attachments.length) return;
        const selected = attachments.filter((d) => d.meta.selected).map((d) => d.id);
        useAttachmentsStore.setState({ selectedAttachments: new Set(selected) });
        useAttachmentsAsyncStore.setState({ attachments });
      });

      useDocoSessionStore.setState({ session });
    }
  }, [session]);

  useLabelsData(session?.user?.email);
  useFoldersData();
  // useFoldersMapData();
  return null;
};
const useLabelsData = (user_mail: string | null | undefined) => {
  // const setLabels = useFoldersExplorerStore(useShallow((state) => state.setLabels));
  const data = useQuery({
    queryKey: ["gmail_labels", user_mail],
    enabled: !!user_mail,
    queryFn: () => {
      return getGmailLabelsAndGroups().then((labels) => labels);
    },
    initialData: useFoldersExplorerStore.getState().labels,
  });
  useEffect(() => {
    if (data.data)
      // console.log({ labels });
      useFoldersExplorerStore.setState({ labels: data.data });
    // setLabels(labels);
  }, [data.data]);
};

const useFoldersData = () => {
  const setFoldersMap = useFoldersMapStore((state) => state.setFoldersMap);
  const baseId = useSelectedFolderId();

  const data = useQuery({
    queryKey: ["folders_tree"],
    enabled: !!baseId,
    queryFn: () => {
      // console.log({ base_id_initial: baseId });
      if (!baseId) return [];
      return getFoldersList(baseId).then((ft) => {
        ft;

        return ft;
      });
    },
    initialData: useFoldersExplorerStore.getState().foldersTree,
  });

  useEffect(() => {
    if (data.data) {
      console.log({ folders_tree: data.data });
      useFoldersExplorerStore.setState({ foldersTree: data.data });
    }
  }, [data]);
  const foldersList = useFoldersExplorerStore((state) => state.foldersTree);
  useEffect(() => {
    if (foldersList.length) {
      setFoldersMap(foldersList);
      console.log({ folders_in_effect: foldersList });
    }
  }, [foldersList]);

  const fm = useFoldersMapStore(useShallow((state) => state.foldersMap));

  useEffect(() => {
    if (fm.size)
      useFoldersMapStore.setState({
        folderIdToNameMap: new Map(foldersList.map(([id, data]) => [`${fm.get(data?.parentFolderId ?? "")?.name}/${data.name}`, id])),
      });
  }, [fm]);
};

// const useFolderIdUpdate = () => {
//   const map = useFoldersMapStore(useShallow((state) => state.foldersMap));
//   const baseId = useFoldersExplorerStore(useShallow((state) => state.baseFolderId));
//   const cid = useFoldersExplorerStore(useShallow((state) => state.baseFolderId));
//   const setCid = useFoldersExplorerStore().setCurrentFolderId;

//   useEffect(() => {
//     console.log("setting ref id");
//     if (cid && map.has(cid)) return;
//     const newId = map.entries().next().value?.[0];
//     if (newId || baseId) setCid(newId ?? baseId ?? "");
//     console.log({ newId, cid, baseId });
//   }, [map]);
//   return null;
// };

// const useFoldersMapData = () => {
// // const folder = useFoldersData();
// const list = useFoldersExplorerStore(useShallow((state) => state.foldersTree));
// const setMap = useFoldersMapStore().setFoldersMap;

// useEffect(() => {
//   setMap(list);
// }, [list]);
// useFolderIdUpdate();
// //   const map = useFoldersMapStore(useShallow((state) => state.foldersMap));
// //   return [map, list[0][0]] as const;
// // return tree ?? null;
// return null;
// };
