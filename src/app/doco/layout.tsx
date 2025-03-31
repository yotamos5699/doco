// import "../globals.css";
import { SessionCache } from "./SessionCache";
import { getCachedSession } from "./_google/clients";
import { DocoModelsWrapper } from "./_models/DocoModelsWrapper";
import { ThemeProvider } from "next-themes";
import { getCachedBaseFolderId, listFilesInFolder, updateFileProperties } from "./_utils/_folders/foldersUtils";
import { getFoldersList } from "./_utils/_folders/getFolders";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ThemeSelector from "@/_components/ThemeSelector";
import { QueryClientProvider_ } from "@/_context/QueryClientProvider_";
import { UpperNav } from "@/_components/UpperNav";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

export default async function MainDocoLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(options);
  // const session = await getCachedSession();
  // console.log({ layout_session: session });
  if (!session) return null;
  // return <ApiTests/>
  return (
    <QueryClientProvider_>
      <SessionCache session={session} />
      <DocoModelsWrapper />
      <UpperNav />
      {children}
    </QueryClientProvider_>
  );
}

const ApiTests = async () => {
  const folderId = await getCachedBaseFolderId();
  // const modifiedAt = await getFolderModified(folderId);
  const foldersRaw = await getFoldersList(folderId);
  const folders = new Map(foldersRaw);
  const folder_files = await listFilesInFolder(folderId);
  const file_id = folder_files[0].fileId;

  const updated_file = await updateFileProperties(file_id, { test: "test1", test2: "test2" });

  return (
    <>
      {JSON.stringify({ updated_file }, null, 2)}
      <div>
        {folder_files.map((f) => (
          <div>{JSON.stringify(f)}</div>
        ))}
      </div>
      <div className={`flex flex-col w-full h-full gap-2`}>
        <ThemeSelector />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead>נתיב</TableHead>
              <TableHead>אב</TableHead>
              <TableHead>בנים</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from(folders).map(([id, f]) => {
              const { name, parentFolderId, path, subFolders, updatedAt } = f;
              console.log("in table:", { name });
              return (
                <TableRow className={`border-2 h-full p-4 `} key={f.id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{updatedAt}</TableCell>
                  <TableCell>
                    {path.map((sf) => (
                      <div>
                        <span>{folders.get(sf)?.name}/</span>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{folders.get(parentFolderId ?? "")?.name ?? ""}</TableCell>
                  <TableCell>
                    {subFolders.map((sf) => (
                      <div>
                        <span>{folders.get(sf)?.name}</span>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
