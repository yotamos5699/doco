import { FolderFilesView } from "./FolderFilesView";

import { FolderPathLinks } from "./FolderPathLinks";
import { SubFoldersView } from "./SubFoldersView";

export const gridStyle_ = `grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 lg:grid-cols-5`;
export function FoldersNavigation() {
  // try {

  return (
    <div className={`flex flex-col w-full gap-4`}>
      <FolderPathLinks />
      <SubFoldersView />
      <FolderFilesView />
      {/* </div> */}
    </div>
  );
  //   } catch (error) {
  // return <div>Error: {error instanceof Error ? error.message : "Unknown error"}</div>;
  //   }
}

// yafit u will force me to answer
//
