"use server";

import { cache } from "react";
const octet_stream = `application/octet-stream`;

interface FileTypeDetectionResult {
  mimeType?: string;
  confidence?: "high" | "low";
}

type MagicNumber = Uint8Array;
type ExtensionMap = Record<string, string>;
type PatternList = MagicNumber[];

interface FileTypePatterns {
  [key: string]: PatternList;
}

const magicNumbers: FileTypePatterns = {
  "application/pdf": [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
  "image/jpeg": [new Uint8Array([0xff, 0xd8, 0xff]), new Uint8Array([0xff, 0xe0]), new Uint8Array([0xff, 0xe1])],
  "image/gif": [new Uint8Array([0x47, 0x49, 0x46, 0x38])],
};

const extensionMap: ExtensionMap = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  json: "application/json",
};

export async function detectFileType(blob: Blob | ArrayBuffer | Uint8Array): Promise<FileTypeDetectionResult> {
  const mimeType = await detectByMagicNumber(blob);
  if (mimeType) {
    return { mimeType, confidence: "high" };
  }

  const extensionType = detectByExtension(blob);
  return extensionType ? { mimeType: extensionType, confidence: "low" } : {};
}

function detectByExtension(blob: Blob | ArrayBuffer | Uint8Array): string | undefined {
  const url = typeof blob === "object" && blob instanceof Blob ? URL.createObjectURL(blob) : blob.toString();

  const parts = url.split(".");
  const extension = parts.length > 1 ? parts.pop() : undefined;
  return extension ? extensionMap[extension.toLowerCase()] : undefined;
}

async function detectByMagicNumber(blob: Blob | ArrayBuffer | Uint8Array): Promise<string | undefined> {
  const arrayBuffer = await (typeof blob === "object" && blob instanceof Blob
    ? blob.arrayBuffer()
    : Array.isArray(blob)
    ? Promise.resolve(new Uint8Array(blob).buffer)
    : Promise.resolve(blob));

  const uint8Array = new Uint8Array(arrayBuffer);

  for (const [mimeType, patterns] of Object.entries(magicNumbers)) {
    for (const pattern of patterns) {
      if (matchPattern(uint8Array, pattern)) {
        return mimeType;
      }
    }
  }

  return undefined;
}

function matchPattern(data: Uint8Array, pattern: Uint8Array): boolean {
  if (data.length < pattern.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (data[i] !== pattern[i]) return false;
  }
  return true;
}

export const loadUrlToDataUrl = async (imageUrl: string) => {
  // Check cache first

  try {
    // Fetch image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    // response.headers.get("content-type")
    // Convert to data URL
    const blob = await response.blob();
    const blobBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(blobBuffer).toString("base64");
    const mimeType = (await detectFileType(blob)).mimeType;
    const pdfBlob = new File([blob], "sasd.pdf", { type: mimeType });
    const objectUrl = URL.createObjectURL(pdfBlob);
    // const dataUrl = `data:${blob.type === octet_stream ? "application/pdf" : blob.type || "image/jpeg"};base64,${base64}`;

    // Cache result

    console.log({ blob_type: blob.type, blobBuffer, size: blob.size, sliced: objectUrl, mimeType });
    return [undefined, { dataUrl: objectUrl, base64, mimeType }] as const;
  } catch (err) {
    return [new Error(`Failed to load image: ${err instanceof Error ? err.message : "Unknown error"}`), undefined] as const;
  }
};
// async function getFileAsDataUrl(fileUrl: string) {
//   try {
//     const response = await fetch(fileUrl);

//     // Check if the response was successful
//     if (!response.ok) {
//       throw new Error(`Failed to fetch file: ${response.statusText}

//         \n response data: ${response.body}
//         `);
//     }
//     // Get the content type header
//     const contentType = response.headers.get("content-type");

//     // Read the response as array buffer

//     const arrayBuffer = await response.arrayBuffer();
//     console.log("link_octet_stream:", { response });

//     // Convert to base64 string
//     const base64String = Buffer.from(arrayBuffer).toString("base64");

//     // Create data URL
//     const dataUrl = `data:${contentType};base64,${base64String}`;

//     return dataUrl;
//     // return base64String;
//   } catch (error) {
//     console.error("Error getting file:", error);
//     throw error;
//   }
// }

// export const getCachedDataUrl = cache(async (data: string, fileName: string, mimeType: string) => {
//   console.log("getCachedDataUrl");
//   try {
//     const d = await decodeBase64(data);
//     const buffer = Buffer.from(d);
//     let base64String = "";
//     let dataUrl = "";
//     // if (mimeType === octet_stream) {
//     //   dataUrl = await getFileAsDataUrl(data);
//     // } else {
//     base64String = buffer.toString("base64");
//     dataUrl = `data:${mimeType};base64,${encodeURIComponent(base64String)}`;
//     // }

//     return [null, dataUrl, base64String] as const;
//   } catch (error) {
//     return [error as Error, null] as const;
//   }
// });

// function decodeBase64(base64String: string): string {
//   return base64String.replace(/-/g, "+").replace(/_/g, "/").replace(/=/g, "");
// }

// "use server";

// import { cache } from "react";

// export const getCachedDataUrl = cache(async (data: string, fileName: string, mimeType: string) => {
//   const urlResult = (await new Promise((res, rej) => {
//     const reader = new FileReader();
//     const decodedData = decodeBase64(data);
//     const file = new File([decodedData], fileName, { type: mimeType });
//     reader.onload = () => res([undefined, reader.result ? reader.result.toString() : ""]);

//     reader.onerror = () => res([new Error(reader.error?.message), undefined] as const);
//     reader.readAsDataURL(file);
//     rej();
//   })) as [Error, undefined] | [undefined, string];
//   console.log({ urlResult });
//   return urlResult;
// });

export async function decodeBase64(base64String: string): Promise<Uint8Array> {
  return new Promise((res) => {
    const base64 = base64String
      .replace(/-/g, "+") // Replace '-' with '+'
      .replace(/_/g, "/") // Replace '_' with '/'
      .replace(/=/g, ""); // Remove padding

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    // Convert binary string to Uint8Array
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    res(bytes);
  });
}

export const createDataUrl = async (imageUrl: string) => {
  return new Promise(async (res, rej) => {
    try {
      const controller = new AbortController();
      const response = await fetch(imageUrl, { signal: controller.signal });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.error) {
          throw reader.error;
        }
        const dataUrl = reader.result as string;
        res([undefined, dataUrl]);
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      res([Error(err?.toString(), { cause: 12 }), undefined]);
    }
  }) as Promise<[Error, undefined] | [undefined, string]>;
};

// Extract file ID from webViewLink
//  const fileId = file.webViewLink?.split('/').pop()?.split('?')[0];

//  // Create direct link
//  const directUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : '';
//   const workingVersion = {
//     name: "cad.dwfx.PDF",
//     thumbnailLink:
//       "https://lh3.googleusercontent.com/drive-storage/AJQWtBM9Xpol_HHvr6MgtIFmSlvqSDEFPcXC6eUfjCinbiS2UsDeb9Oa8dU0QBcye8GKyAcb7H5fXMxYDQGq9XoalCfgSEdG08PikobNG5JrNwkelQ=s220",
//   };
//   const notWorkingVersion = {
//     name: "cad.dwfx.PDF",
//     thumbnailLink:
//       "https://lh3.googleusercontent.com/drive-storage/AJQWtBNsPDUTaRdLo-11Cht5u5q2khNESS3gr5-Oe87u7klcJSQLEpFoQevXtLUiZbPYj-YTR-IHXUxPUlkLX3wSfmiv-lLkkgiUs4hIy7-6PvBLe-0=s220",
//   };
