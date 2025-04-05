import { useEffect, useRef } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
const useThumbnailStoreCache = create<{ links: [string, { ttl: number; data: string }][] }>()(
  persist(
    (set) => ({
      links: [],
    }),

    {
      name: "thumbnail_cache_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
const useThumbNailStore = create<{ thumbsCache: Map<string, { ttl: number; data: string }> }>((set) => ({ thumbsCache: new Map() }));
export const useThumbsSync = () => {
  const initiated = useRef(false);
  const links = useThumbnailStoreCache((state) => state.links);
  const mapValues = useThumbNailStore((state) => state.thumbsCache);
  useEffect(() => {
    if (links.length) {
      initiated.current = true;
      useThumbNailStore.setState({ thumbsCache: new Map(links) });
    }
  }, []);
  useEffect(() => {
    useThumbnailStoreCache.setState({ links: Array.from(mapValues.entries()) });
  }, [mapValues]);
};
export const getCachedThumbnail = (id: string) => {
  // const now = Date.now()
  const img = useThumbNailStore.getState().thumbsCache.get(id);

  return img ?? null;
};
export const setCachedThumbnail = (id: string, data: string) => {
  // const now = Date.now()
  useThumbNailStore.getState().thumbsCache.set(id, { ttl: 11, data });
};
