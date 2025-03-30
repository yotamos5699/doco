"use client";

import { GetNewAttachmentsFilesButtons } from "../attachments/_components/_buttons/GetNewAttachmentsMetaButtons";
import { docoStyle_ } from "../attachments/types";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TabName } from "./TabsContent_";

// import { useEffect } from "react";

// import useLocalStorage from "@/_hooks/useLocalStorage";
// import Link from "next/link";

export const TabsNavigation = () => {
  const searchParams = useSearchParams();
  const tabValue = searchParams.get("tab");
  console.log({ searchParams });

  const changeTab = (t: TabName) => {
    history.pushState(null, "", `?tab=${t}`);
  };
  return (
    <TabsList className="gap-12">
      <div className={`flex items-center`}>
        <TabsTrigger onPointerDown={() => changeTab("documents")} value="documents">
          {/* <Link href={`/doco?tab=documents`}> */}
          מסמכים
          {/* </Link> */}
        </TabsTrigger>
        <TabsTrigger
          onPointerDown={() => {
            console.log("attachments triger");
            changeTab("attachments");
          }}
          value="attachments"
        >
          {/* <Link prefetch={true} href={`/doco?tab=attachments`}> */}
          חדשים
          {/* </Link> */}
        </TabsTrigger>
      </div>
      <div className={`flex border-r`}>
        {tabValue === "attachments" ? (
          <>
            <GetNewAttachmentsFilesButtons />
          </>
        ) : (
          <>
            <Button className={docoStyle_.btn.css} variant={docoStyle_.vari}>
              <span>ייצא</span>
              <Download size={docoStyle_.btn.size} />
            </Button>
            <Button className={docoStyle_.btn.css} variant={docoStyle_.vari}>
              <span>ייצא</span>
              <Download size={docoStyle_.btn.size} />
            </Button>
          </>
        )}
      </div>
    </TabsList>
  );
};
