"use client";

import { Button } from "@/components/ui/button";
import { getMapValue, useSubFolders } from "../../../_doco/_stores/_documents_stores/foldersStores";
import { Card } from "@/components/ui/card";
import { Folder, MoreVertical } from "lucide-react";
import { useFoldersExplorerStore } from "../../../_doco/SessionCache";
import { gridStyle_ } from "./FoldersNavigation";

export const SubFoldersView = () => {
  const ids = useSubFolders();
  const setCurrentId = useFoldersExplorerStore((state) => state.setCurrentFolderId);
  return (
    <div className={gridStyle_}>
      {/* {JSON.stringify(ids)} */}
      {ids.map((id) => {
        const folder = getMapValue(id);

        if (!folder) return null;
        return (
          <Button variant={"secondary"} onPointerDown={() => setCurrentId(id)} key={id}>
            <Folder className={`w-1/12`} />
            <p className={`col-span-5 w-9/12`}>{folder.name}</p>
            <Button variant={"link"} className={`flex  w-2/12`}>
              <MoreVertical />
            </Button>
          </Button>
        );
      })}
    </div>
  );
};
