import { useAttachmentsStore } from "../../../_doco/_stores/attachments_stores/useAttachmentsStore";

export async function downloadFile(webContentLink?: string | null) {
  if (!webContentLink) return;
  try {
    const link = document.createElement("a");
    link.href = webContentLink;
    link.download = "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    // URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
//  const downloadFile = () => file.webContentLink && fetch(file.webContentLink, { mode: "no-cors" });
export const viewFile = (webViewLink?: string | null) => {
  const setMd = useAttachmentsStore((state) => state.setMd);
  setMd({ content: <iframe src={webViewLink?.replace("view", "preview") ?? ""} /> });
};
