import React from "react";
import { Attachments } from "./Attachments";
import { Card } from "@/components/ui/card";
import { unstable_cacheTag } from "next/cache";

export default async function page() {
  "use cache";
  unstable_cacheTag("attachments");

  return (
    <Card>
      {/* <h1 className={`text-6xl`}>{tabValue}</h1> */}

      <Attachments />
    </Card>
  );
}
