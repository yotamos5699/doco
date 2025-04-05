import { TabName } from "../_tabs/TabsContent_";

export type GetSearchParamsProps = Promise<{ [key: string]: string | string[] | undefined }>;

export const getSearchParams = async (searchParams?: GetSearchParamsProps) => {
  const params = await searchParams;
  console.log("getSearchParams: ", { params });
  return (params?.tab ?? "documents") as TabName;
};
