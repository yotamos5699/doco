import { create } from "zustand";

const useThumbNailStore = create<{ thumbsCache: Map<string, { ttl: number; data: string }> }>((set) => ({ thumbsCache: new Map() }));
export const getCachedThumbnail = (id: string) => {
  // const now = Date.now()
  const img = useThumbNailStore.getState().thumbsCache.get(id);

  return img ?? null;
};
export const setCachedThumbnail = (id: string, data: string) => {
  // const now = Date.now()
  useThumbNailStore.getState().thumbsCache.set(id, { ttl: 11, data });
};
