import { Date_Range, useFoldersExplorerStore } from "../../../_doco/SessionCache";

export const getQueryString = () => {
  const discludedLabels = useFoldersExplorerStore.getState().discludedLabels;
  // const labelsIds = useFoldersExplorerStore
  //   .getState()
  //   .labels.map((l) => l.id)
  //   .filter((l) => l && !discludedLabels.includes(l));

  const dr = useFoldersExplorerStore.getState().dateRange;
  useFoldersExplorerStore.setState({ lastSynced: { range: { from: dr.from, to: dr.to }, action: new Date().getTime() } });
  let query = "has:attachment";

  if (dr?.from) {
    query += ` after:${dr.from}`;
  }
  if (dr?.to) {
    query += ` before:${dr.to}`;
  }
  if (discludedLabels.length) {
    const labelQueries = discludedLabels.map((label) => `-labelId:${label}`);
    query += ` (${labelQueries.join(" ")})`;
  }
  // if (labelsIds.length) {
  // const labelQueries = labelsIds.map((label) => `labelId:${label}`);
  // query += ` (${labelQueries.join(" OR ")})`;
  // }
  return query;
};

export const getUnixTimestamp = (date?: string) => new Date().getTime();
// Math.floor((date ? new Date(date) : new Date()).getTime() / 1000);

// export const decodeBase64 = (base64String: string): Uint8Array => {
//   const base64 = base64String
//     .replace(/-/g, "+") // Replace '-' with '+'
//     .replace(/_/g, "/") // Replace '_' with '/'
//     .replace(/=/g, ""); // Remove padding

//   const binaryString = atob(base64);
//   const bytes = new Uint8Array(binaryString.length);

//   // Convert binary string to Uint8Array
//   for (let i = 0; i < binaryString.length; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }

//   return bytes;
// };
