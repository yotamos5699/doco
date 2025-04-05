import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

import { FileData, PermType } from "../../_utils/save_file_utils/types";
import { useShallow } from "zustand/react/shallow";

type DocData = [string, FileData][];
export type PermTask = { folderId: string; files: PermType[] };
type MapData = Map<string, FileData>;
type DocumentsStoreProps = {
  documents: DocData;
  notPermited: string[];
  permited: string[];
  //  PermTask[];
};

export const useDocumentsStore = create<DocumentsStoreProps, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      documents: [],
      notPermited: [],
      permited: [],
    }),
    {
      name: "documents_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const delPermRequests = (ids: string[]) => {
  useDocumentsMapStore.setState({ permRequests: new Set() });

  useDocumentsMapStore.setState({ permNeeded: new Set(useDocumentsMapStore.getState().permNeeded.difference(new Set(ids))) });
};

export const usePermStatus = (id: string) => {
  const needPerms = useDocumentsMapStore(useShallow((state) => state.permNeeded));
  const permRequests = useDocumentsMapStore(useShallow((state) => state.permRequests));
  return permRequests.has(id) ? "UPDATING" : needPerms.has(id) ? "FORBIDDEN" : "OK";
};
export const setPermRequests = (ids: string[]) => {
  useDocumentsMapStore.setState({ permRequests: new Set(ids) });
};

export const initiateFilesData = () => {
  const docs = useDocumentsStore.getState().documents;
  useDocumentsMapStore.setState({ data: new Map(docs.map((d) => [d[0], d[1]])) });
};
export const storeFilesData = () => {
  const documents = Array.from(useDocumentsMapStore.getState().data.entries());
  useDocumentsStore.setState({ documents });
};

export const addFilesData = (docs: FileData[]) => {
  const map = useDocumentsMapStore.getState().data;
  for (let i = 0; i < docs.length; i++) {
    const id = docs[i].fileId;
    if (id) map.set(id, docs[i]);
  }
};
export const deleteFilesData = (type: "folder" | "docs", ids: string[]) => {
  const map = useDocumentsMapStore.getState().data;
  if (type === "docs") {
    for (let i = 0; i < ids.length; i++) {
      map.delete(ids[i]);
    }
    // return { data: new Map(newMap) };
  } else if (type === "folder") {
    let toDelete: string[] = [];
    for (const [id, data] of map.entries())
      if (data.parents && data.parents[0] !== ids[0]) {
        toDelete.push(id);
      }
    for (let i = 0; i < toDelete.length; i++) {
      map.delete(toDelete[i]);
    }
  }
  // return { data: new Map(Array.from(state.data.entries()).filter((d) => d[1].parents && d[1].parents[0] !== ids[0])) };
};

export const isFolderModified = (folderId: string, updatedAt: string) => {
  const ld = useDocumentsMapStore.getState().updates.get(folderId);
  if (ld !== updatedAt) {
    useDocumentsMapStore.getState().updates.set(folderId, updatedAt);
    return true;
  }
  return false;
};

type DocumentsMapStoreProps = {
  permRequests: Set<string>;
  permNeeded: Set<string>;
  updates: Map<string, string>;
  data: MapData;
};
export const useDocumentsMapStore = create<DocumentsMapStoreProps>((set) => ({
  permRequests: new Set(),
  permNeeded: new Set(),
  updates: new Map(),
  data: new Map(),
}));
