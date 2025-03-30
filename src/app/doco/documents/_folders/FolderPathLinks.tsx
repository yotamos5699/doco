"use client";
import { useFoldersExplorerStore } from "../../SessionCache";
import { Button } from "@/components/ui/button";
import { useFolderPath, getMapValue } from "../../_stores/_documents_stores/foldersStores";
import { delPermRequests, setPermRequests, useDocumentsStore } from "../../_stores/_documents_stores/useDocumentsStore";
import { removePermissions, setFilePermissionMulti } from "../../_utils/_files/permissions";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const FolderPathLinks = () => {
  const { path, cmap, currentFolder } = useFolderPath();
  //
  const setCurrentFolder = useFoldersExplorerStore().setCurrentFolderId;
  // const current_map = useFoldersMapStore((state) => state.foldersMap);
  // console.log("[map_data]:", { cmap, current_map, currentFolder });
  return (
    <div className={`flex w-full justify-between`}>
      <div className={`flex p-[1px]`}>
        {path.map((route) => {
          const fl = getMapValue(route);
          console.log({ route, sel_path_folder: fl });
          if (!fl) return null;
          const isCurrent = fl.id === currentFolder;
          return (
            <div key={route} className={`flex items-center`}>
              <Button
                onPointerDown={() => {
                  if (isCurrent) return;
                  setCurrentFolder(fl.id);
                }}
                className={`${isCurrent ? "font-bold" : "opacity-65"} p-0`}
                variant={"link"}
              >
                {fl.name}
              </Button>
              <span className={`text-sm font-extrabold p-[1px]`}>\</span>
            </div>
          );
        })}
        <div className={`flex items-center font-bold`}>
          <div>{cmap?.name}</div>
        </div>
      </div>
      <UpdateFilesPermissions />
    </div>
  );
};

const UpdateFilesPermissions = () => {
  const closed_ids = useDocumentsStore((state) => state.notPermited);
  const opened_ids = useDocumentsStore((state) => state.permited);
  const openPermsMut = useMutation({
    mutationFn: (ids: string[]) => {
      setPermRequests(ids);
      return setFilePermissionMulti(ids);
    },
    onMutate: (d) => {
      delPermRequests(d);
      useDocumentsStore.setState({
        notPermited: opened_ids.filter((id) => !d.includes(id)),
        permited: [...opened_ids, ...d],
      });
    },
  });
  const removePermsMut = useMutation({
    mutationFn: (ids: string[]) => {
      setPermRequests(ids);
      return removePermissions(ids).then((d) => {
        console.log({ removed_ids: d });
        return d;
      });
    },
    onMutate: (d) => {
      delPermRequests(d);
      useDocumentsStore.setState({
        permited: closed_ids.filter((id) => !d.includes(id)),
        notPermited: [...closed_ids, ...d],
      });
    },
  });
  console.log("perms_ids:", { closed_ids, opened_ids });
  return (
    <div className={`flex`}>
      <Button
        onPointerDown={() => openPermsMut.mutate(closed_ids)}
        disabled={!closed_ids.length}
        variant={"secondary"}
        className={`flex gap-2`}
      >
        <span>פתח הרשאות</span>
        <div className="relative">
          <div
            className={`absolute ${
              !closed_ids.length ? "opacity-0" : "opacity-100"
            } flex w-full h-full justify-center items-center transition-all duration-500`}
          >
            {openPermsMut.isPending ? (
              <Loader2 className={`animate-spin duration-2000`} />
            ) : (
              <span className={`text-sky-500 text-sm`}>{closed_ids.length}</span>
            )}
          </div>
          {/* <Circle   size={32} /> */}
        </div>
      </Button>
      <Button
        onPointerDown={() => removePermsMut.mutate(opened_ids)}
        disabled={!opened_ids.length}
        variant={"secondary"}
        className={`flex gap-2`}
      >
        <span>סגור הרשאות</span>
        <div className="relative">
          <div
            className={`absolute ${
              !opened_ids.length ? "opacity-0" : "opacity-100"
            } flex w-full h-full justify-center items-center transition-all duration-500`}
          >
            {removePermsMut.isPending ? (
              <Loader2 className={`animate-spin duration-2000`} />
            ) : (
              <span className={`text-sky-500 text-sm`}>{opened_ids.length}</span>
            )}
          </div>
          {/* <Circle   size={32} /> */}
        </div>
      </Button>
    </div>
  );
};
