"use client";

import { GetNewAttachmentsFilesButtons } from "../../app/attachments/_components/_buttons/GetNewAttachmentsMetaButtons";
import { docoStyle_ } from "../../app/attachments/types";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { TabName } from "./TabsContent_";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// import { useEffect } from "react";

// import useLocalStorage from "@/_hooks/useLocalStorage";
// import Link from "next/link";

export const TabsNavigation = () => {
  const path = usePathname();

  return (
    <Card className="flex flex-row p-0 border-4">
      {/* {JSON.stringify(path)} */}
      <div className={`flex items-center gap-2`}>
        <Link href={"/"} className={`${path !== "/" && "opacity-70"}`}>
          <Button variant={"link"}>ראשי</Button>
        </Link>
        <Link href={"/documents"} className={`${path !== "/documents" && "opacity-70"}`}>
          <Button variant={"link"}>מסמכים</Button>
        </Link>
        <Link href={"/attachments"} className={`${path !== "/attachments" && "opacity-70"}`}>
          <Button variant={"link"}>חדשים</Button>
        </Link>
      </div>
      <div className={`flex `}>
        {path === "/attachments" ? (
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
    </Card>
  );
};
