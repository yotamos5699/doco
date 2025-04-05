"use client";

import { TabsContent } from "@/components/ui/tabs";

import { useSearchParams } from "next/navigation";
import { Attachments } from "../../app/attachments/Attachments";
import { Documents } from "../../app/documents/Documents";
// import { useEffect } from "react";

export type TabName = "documents" | "attachments";

export const TabsContent_ = () => {
  const searchParams = useSearchParams();
  const tabValue = searchParams.get("tab") ?? "documents";

  return (
    <>
      <TabsContent className={`${tabValue === "attachments" && "hidden"}`} forceMount value="documents">
        {/* <h1 className={`text-6xl`}>{tabValue}</h1> */}
        <Documents />
      </TabsContent>
    </>
  );
};

// const createQueryString = (name: string, value: string, searchParams: ReadonlyURLSearchParams) => {
//   const params = new URLSearchParams(searchParams.toString());
//   params.set(name, value);

//   return params.toString();
// };

// const params = searchParams.get("tab");

// const tabValue = (params as TabName | null) ?? "documents";
// console.log({ tabValue, params });
//   useEffect(() => {
//     if (tabValue && tabValue !== tab) {
//       changeTab(tabValue);
//     } else {
//     //   modifyUrl(tab);
//        changeTab("documents");
//     }
//   }, []);
