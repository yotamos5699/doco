"use client";
import { FileComponent } from "../_components/FileComponent";
import { useQuery } from "@tanstack/react-query";
import { getAllFiles } from "../../../_doco/_utils/_files/get_all_files";
import { useFoldersExplorerStore } from "../../../_doco/SessionCache";
import { Loader2 } from "lucide-react";

export const AllFilesList = () => {
  //   const data: FileData[] = [];
  const folders = useFoldersExplorerStore((state) => state.foldersTree);
  const { error, data } = useQuery({ queryKey: ["all_files"], queryFn: () => getAllFiles(folders) });
  if (error) return <h1>error</h1>;
  if (!data) return <Loader2 size={40} className={`animate-spin duration-2000`} />;
  return (
    <div className={`flex flex-wrap`}>
      {/* {JSON.stringify(data)} */}
      {data.map((doc) => (
        <FileComponent key={doc.fileId} file={doc} />
      ))}
    </div>
  );
};
