import { create } from "zustand";
import { FolderData, FolderData2 } from "../../_utils/save_file_utils/types";
import { useSelectedFolderId } from "../../SessionCache";
import { useShallow } from "zustand/react/shallow";

const ft = {
  folders_tree: [
    [
      "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
      {
        id: "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
        name: "doco_files",
        updatedAt: "2025-03-10T21:38:54.323Z",
        path: ["0AOGg1zOBRgC4Uk9PVA"],
        subFolders: ["1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_", "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI", "1JOfMINutcVPgy1tnzur7CWLxHlw2Vk5n"],
        parentFolderId: "0AOGg1zOBRgC4Uk9PVA",
      },
    ],
    [
      "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
      {
        id: "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
        name: "תיקיה א 3",
        updatedAt: "2025-03-10T21:42:32.900Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2"],
        subFolders: ["1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k"],
        parentFolderId: "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
      },
    ],
    [
      "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI",
      {
        id: "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI",
        name: "תיקיה א 2",
        updatedAt: "2025-03-10T21:42:24.083Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2"],
        subFolders: ["1zQCAtWVR2S70ColPbKtTfcwKlZ4sZToX", "12u9JhuS5Z1Al0WfYF5vv0mHR2PhOAbXD"],
        parentFolderId: "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
      },
    ],
    [
      "1JOfMINutcVPgy1tnzur7CWLxHlw2Vk5n",
      {
        id: "1JOfMINutcVPgy1tnzur7CWLxHlw2Vk5n",
        name: "תיקיה א 1",
        updatedAt: "2025-03-10T21:42:13.545Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2"],
        subFolders: ["1oc6PRV_P_OiZG3v47POmGYOoAZSfbweq"],
        parentFolderId: "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
      },
    ],
    [
      "1oc6PRV_P_OiZG3v47POmGYOoAZSfbweq",
      {
        id: "1oc6PRV_P_OiZG3v47POmGYOoAZSfbweq",
        name: "תיקיה ב 1 ",
        updatedAt: "2025-03-10T21:43:04.175Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2", "1JOfMINutcVPgy1tnzur7CWLxHlw2Vk5n"],
        subFolders: [],
        parentFolderId: "1JOfMINutcVPgy1tnzur7CWLxHlw2Vk5n",
      },
    ],
    [
      "1zQCAtWVR2S70ColPbKtTfcwKlZ4sZToX",
      {
        id: "1zQCAtWVR2S70ColPbKtTfcwKlZ4sZToX",
        name: "תיקיה ב 2",
        updatedAt: "2025-03-10T21:43:32.413Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2", "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI"],
        subFolders: ["1L7Ar9etIWIiMdskMsmDAbco4n9KdTQ58"],
        parentFolderId: "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI",
      },
    ],
    [
      "12u9JhuS5Z1Al0WfYF5vv0mHR2PhOAbXD",
      {
        id: "12u9JhuS5Z1Al0WfYF5vv0mHR2PhOAbXD",
        name: "תיקיה ב 1",
        updatedAt: "2025-03-10T21:43:24.968Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2", "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI"],
        subFolders: [],
        parentFolderId: "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI",
      },
    ],
    [
      "1L7Ar9etIWIiMdskMsmDAbco4n9KdTQ58",
      {
        id: "1L7Ar9etIWIiMdskMsmDAbco4n9KdTQ58",
        name: "תיקיה ג 1",
        updatedAt: "2025-03-10T21:43:44.499Z",
        path: [
          "0AOGg1zOBRgC4Uk9PVA",
          "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
          "1KBqCl3Qh_UxdXe4l7akx7cbKavP0MfaI",
          "1zQCAtWVR2S70ColPbKtTfcwKlZ4sZToX",
        ],
        subFolders: [],
        parentFolderId: "1zQCAtWVR2S70ColPbKtTfcwKlZ4sZToX",
      },
    ],
    [
      "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
      {
        id: "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
        name: "תיקיה ב 1",
        updatedAt: "2025-03-10T21:44:05.686Z",
        path: ["0AOGg1zOBRgC4Uk9PVA", "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2", "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_"],
        subFolders: ["1fk-Ag8UT-NrZpgEZWfWYznEvv-vLmedR", "1EdXZ2lud9q6-eMs5jFx5_4UCCxkGA-GP", "1WUfOz8ducC574903rf3-eGIljg_cGFMI"],
        parentFolderId: "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
      },
    ],
    [
      "1fk-Ag8UT-NrZpgEZWfWYznEvv-vLmedR",
      {
        id: "1fk-Ag8UT-NrZpgEZWfWYznEvv-vLmedR",
        name: "תיקיה ג 3",
        updatedAt: "2025-03-10T21:44:33.784Z",
        path: [
          "0AOGg1zOBRgC4Uk9PVA",
          "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
          "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
          "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
        ],
        subFolders: ["1Zu00pplBkVT-2-7aHO2VPJdyWe76yaIZ"],
        parentFolderId: "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
      },
    ],
    [
      "1EdXZ2lud9q6-eMs5jFx5_4UCCxkGA-GP",
      {
        id: "1EdXZ2lud9q6-eMs5jFx5_4UCCxkGA-GP",
        name: "תיקיה ג 2",
        updatedAt: "2025-03-10T21:44:26.631Z",
        path: [
          "0AOGg1zOBRgC4Uk9PVA",
          "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
          "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
          "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
        ],
        subFolders: [],
        parentFolderId: "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
      },
    ],
    [
      "1WUfOz8ducC574903rf3-eGIljg_cGFMI",
      {
        id: "1WUfOz8ducC574903rf3-eGIljg_cGFMI",
        name: "תיקיה ג 1",
        updatedAt: "2025-03-10T21:44:14.966Z",
        path: [
          "0AOGg1zOBRgC4Uk9PVA",
          "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
          "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
          "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
        ],
        subFolders: [],
        parentFolderId: "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
      },
    ],
    [
      "1Zu00pplBkVT-2-7aHO2VPJdyWe76yaIZ",
      {
        id: "1Zu00pplBkVT-2-7aHO2VPJdyWe76yaIZ",
        name: "תיקיה ד 1",
        updatedAt: "2025-03-10T21:44:43.994Z",
        path: [
          "0AOGg1zOBRgC4Uk9PVA",
          "1FXhe0fY89DfVJz6Dh5J7JMuzm0XwuET2",
          "1mWFdWmSGU5ASdF4khCHwjTThjseQhY8_",
          "1ldewDM-DDWZRBKQAzQwae0bVA1zy_B2k",
          "1fk-Ag8UT-NrZpgEZWfWYznEvv-vLmedR",
        ],
        subFolders: [],
        parentFolderId: "1fk-Ag8UT-NrZpgEZWfWYznEvv-vLmedR",
      },
    ],
  ],
};
export const useFoldersMapStore = create<{
  folderIdToNameMap: Map<string, string>;
  foldersMap: Map<string, FolderData2>;
  setFoldersMap: (v: [string, FolderData2][]) => void;
}>((set) => ({
  foldersMap: new Map(),
  setFoldersMap: (vals) =>
    set({ foldersMap: new Map(vals), folderIdToNameMap: new Map(vals.map(([id, data]) => [`${data.name}:${data.parentFolderId}`, id])) }),
  folderIdToNameMap: new Map(),
}));

export const getMapValue = (id: string) => {
  return useFoldersMapStore.getState().foldersMap.get(id);
};
export const useMapValue = (id: string) => {
  const foldersMap = useFoldersMapStore(useShallow((state) => state.foldersMap));

  return foldersMap.get(id);
};

export const useFolderPath = () => {
  const currentFolder = useSelectedFolderId();
  const cmap = useMapValue(currentFolder);

  const path = useFoldersMapStore(useShallow((state) => state.foldersMap)).get(currentFolder)?.path ?? [];
  console.log({ currentFolder, cmap, path });
  return { path, cmap, currentFolder };
};
export const useSubFolders = () => {
  const id = useSelectedFolderId();

  const folder = useMapValue(id);
  console.log({ id, subFolders: folder?.subFolders });
  return folder?.subFolders ?? [];
};
