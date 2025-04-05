import { File } from "lucide-react";

export const FileMetaData = ({ fileName }: { fileName: string }) => {
  return (
    <div
      className={` absolute top-0   flex  items-center   bg-slate-300/30 dark:bg-slate-900/60  p-3 w-full   bg-le  justify-between     `}
    >
      <File className={`text-sky-600 w-1/12   font-bold`} size={14} />

      <div className={`flex  items-center overflow-clip  w-11/12 px-1   text-start  text-xs  text-nowrap`}>{fileName}</div>
    </div>
    // </div>
  );
};
