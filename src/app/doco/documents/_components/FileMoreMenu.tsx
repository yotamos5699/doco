import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ExternalLink, MoreVertical } from "lucide-react";
export const FileMoreMenu = ({ nodes }: { nodes: React.ReactNode[] }) => (
  <Menubar dir="rtl" className="p-0 bg-none border-0  ">
    <MenubarMenu>
      <MenubarTrigger className="bg-none/1 p-0 bg-red-400 bg-non dark:bg-none border-0 ">
        <MoreVertical className="" />
      </MenubarTrigger>
      <MenubarContent align="end">
        {nodes.map((n) => (
          <MenubarItem>
            <div className={`w-11/12`}>{n}</div>
            <MenubarShortcut className={`w-1/12`}>⌘T</MenubarShortcut>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);

// <MenubarItem>
//   New Tab
// </MenubarItem>
// <MenubarItem>New Window</MenubarItem>
// <MenubarSeparator />
// <MenubarItem>Share</MenubarItem>
// <MenubarSeparator />
// <MenubarItem>Print</MenubarItem>
