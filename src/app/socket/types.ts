export type DriveChangeNotification = {
  kind: "api#channel"; // Always "api#channel"
  id: string; // Watch ID (e.g., "folderId-socketId-timestamp")
  resourceId: string; // ID of the resource that changed
  resourceUri: string; // URL of the watched resource
  token?: string; // (Optional) Custom token if set in the watch request
  expiration?: string; // Expiration time of the watch (milliseconds since epoch)
  type: "web_hook"; // Always "web_hook"
  changes?: DriveChange[]; // List of changes (optional, inferred)
  folderId: string; // Extracted folder ID from the watch ID
};

type ChangeActionType = "created" | "modified" | "deleted" | "trashed" | "untrashed" | "moved" | "shared" | "unshared";
type DriveChange = {
  fileId: string; // The ID of the changed file
  fileName?: string; // File name (may need an additional API request)
  mimeType?: string; // MIME type of the file
  modifiedTime?: string; // Timestamp of last modification
  action: ChangeActionType;
  parentFolderId?: string; // The folder that contains the changed file
};

export type WatchFolderProps = {
  //   id: string;
  folderIds: string[];

  refresh_token: string;
  access_token: string;
};

export type SocketMessage = { type: "watcher-props"; data: WatchFolderProps };

type WatcherResponse = { folderIds: string[]; message: string };
export type SocketResponse =
  | (WatcherResponse & ({ type: "watch-started" } | { type: "watch-error" }))
  | { type: "changes"; data: DriveChangeNotification };
