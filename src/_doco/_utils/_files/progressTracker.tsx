import { EventEmitter } from "events";

const createProgressTracker = () => {
  const progressTracker = new EventEmitter();
  progressTracker.setMaxListeners(100);
  const uploads = new Map<string, number>();

  return {
    startUpload: (fileId: string) => {
      uploads.set(fileId, 0);
      return fileId;
    },
    updateProgress: (fileId: string, bytesRead: number, totalSize: number) => {
      const progress = (bytesRead / totalSize) * 100;
      uploads.set(fileId, progress);
      progressTracker.emit("progress", { fileId, progress });
    },
    getProgress: (fileId: string) => {
      return uploads.get(fileId) ?? 0;
    },
    removeUpload: (fileId: string) => {
      uploads.delete(fileId);
    },
    on: (event: string, handler: (data: { fileId: string; progress: number }) => void) => {
      progressTracker.on(event, handler);
    },
    off: (event: string, handler: (data: { fileId: string; progress: number }) => void) => {
      progressTracker.off(event, handler);
    },
  };
};

export const progressTracker = createProgressTracker();
