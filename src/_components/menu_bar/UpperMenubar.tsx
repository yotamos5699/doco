"use client";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { UserImage } from "./_items/UserImage";
import { LogOut, Settings } from "lucide-react";
import ThemeSelector from "../ThemeSelector";
import { signOut } from "next-auth/react";

export function UpperMenubar() {
  return (
    <Menubar
    // className="flex"
    >
      <MenubarMenu>
        <MenubarTrigger>
          <Settings size={14} />
          {/* <UserImage /> */}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <ThemeSelector />
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <UserImage />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onPointerDown={() => signOut()}>
            <LogOut />
          </MenubarItem>
          <MenubarItem>
            <ThemeSelector />
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

//   <MenubarItem>
//   New Window <MenubarShortcut>⌘N</MenubarShortcut>
// </MenubarItem>
// <MenubarItem disabled>New Incognito Window</MenubarItem>
// <MenubarSeparator />
// <MenubarSub>
//   <MenubarSubTrigger>Share</MenubarSubTrigger>
//   <MenubarSubContent>
//     <MenubarItem>Email link</MenubarItem>
//     <MenubarItem>Messages</MenubarItem>
//     <MenubarItem>Notes</MenubarItem>
//   </MenubarSubContent>
// </MenubarSub>
// <MenubarSeparator />
// <MenubarItem>
//   Print... <MenubarShortcut>⌘P</MenubarShortcut>
// </MenubarItem>
{
  /* <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Search the web</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Find...</MenubarItem>
                <MenubarItem>Find Next</MenubarItem>
                <MenubarItem>Find Previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="benoit">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent>
        </MenubarMenu> */
}
