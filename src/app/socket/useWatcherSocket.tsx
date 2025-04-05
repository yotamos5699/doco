"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DriveChangeNotification, SocketMessage, SocketResponse } from "./types";
import { useEffect } from "react";
import { getGoogleTokens } from "@/_doco/_cookiesStore/googleCookies";
import { usePathname } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useFoldersExplorerStore } from "@/_doco/SessionCache";
type ErrorType = { ts: number; data: string };
export const useSocketLogsStore = create<{
  errors: ErrorType[];
  setErrors: (errors: ErrorType[]) => void;
  logs: DriveChangeNotification[];
  setLogs: (data: DriveChangeNotification[]) => void;
}>()(
  persist(
    (set) => ({
      errors: [],
      setErrors: (err) => set((state) => ({ errors: [...state.errors, ...err] })),
      logs: [],
      setLogs: (data) => set((state) => ({ logs: [...state.logs, ...data] })),
    }),

    {
      name: "socket_logs_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSocketStore = create<{ socket: null | WebSocket }>((set) => ({
  socket: null,
}));
export const parseMessage = (message: string) => {
  try {
    return JSON.parse(message) as SocketResponse;
  } catch (parsing_error) {
    console.error({ parsing_error });
    return null;
  }
};

export const setFolderWatchers = (folderIds: string[]) => {
  getGoogleTokens().then((res) => {
    const { access_token, refresh_token } = res;
    useSocketStore
      .getState()
      .socket?.send(JSON.stringify({ type: "watcher-props", data: { refresh_token, access_token, folderIds } } as SocketMessage));
  });
};
//http://localhost:3000/socket

const createUrl = (hostName: string, id: string) => {
  if (hostName === "localhost") return `http://localhost:8000?id=${id}`;
  return `https://google-api-watcher.deno.dev?id=${id}`;
};

export const useSyncWatchersList = () => {
  const socket = useSocketStore(useShallow((state) => state.socket));
  const folders = useFoldersExplorerStore(useShallow((state) => state.foldersTree));
  useEffect(() => {
    if (socket?.readyState && folders.length) setFolderWatchers(folders.map((f) => f[0]));
  }, [socket, folders]);
};

export const useWatcherSocket = ({ socketId }: { url: string; socketId: string }) => {
  //   const url = usePathname;

  const setLogs = useSocketLogsStore((state) => state.setLogs);
  const setErrors = useSocketLogsStore((state) => state.setErrors);
  useEffect(() => {
    const ws = new WebSocket(createUrl(window.location.hostname, socketId));
    ws.onopen = () => console.log("socket opened !!");
    ws.onerror = (error) => console.log({ error });
    ws.onmessage = (e) => {
      const message = parseMessage(e.data);
      switch (message?.type) {
        case "changes": {
          setLogs([message.data]);
          break;
        }
        case "watch-started":
        case "watch-error": {
          setErrors([{ ts: Date.now(), data: message.type }]);
          break;
        }
        default: {
          setErrors([{ ts: Date.now(), data: "no socket action" }]);
        }
      }
    };
    useSocketStore.setState({ socket: ws });
    return () => ws.close();
  }, [socketId]);
  useSyncWatchersList();
  return null;
};
