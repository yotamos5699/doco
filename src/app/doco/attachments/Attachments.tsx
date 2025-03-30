// export const dynamic = "force-static";
// "use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentsPreviewGrid } from "./_components/AttachmentsPreviewGrid";
import { AttachmentsActionsButtons } from "./_components/_buttons/AttachmentsActionsButtons";
import { NewAttachmentsMetaButton } from "./_components/_buttons/GetNewAttachmentsMetaButtons";
import LabelsAndGroups from "./_components/LabelsAndGroups";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DatePickerWithPresets } from "./_components/DatePickerWithPresets";
// import { AttachmentsActions } from "./AttachmentsActions";

export function Attachments() {
  return (
    <>
      <Card>
        <CardHeader className={`p-0`}>
          <div className={`flex items-center gap-2`}>
            <Accordion type="single" collapsible className="max-w-full p-0">
              <AccordionItem value="item-1">
                <div className={`flex  items-center h-10 gap-2`}>
                  {/* <CardTitle className={`text-3xl`}>חדשים</CardTitle> */}
                  <DatePickerWithPresets />

                  <AccordionTrigger className={`flex gap-1 text-sm`}>
                    <span>תוויות</span>
                    <span className={`hidden sm:block`}>חיפוש</span>
                  </AccordionTrigger>
                  <div className={`flex`}>
                    <NewAttachmentsMetaButton />
                    <AttachmentsActionsButtons />
                  </div>
                </div>

                <AccordionContent>
                  <LabelsAndGroups />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* <AttachmentsActions /> */}
          </div>
        </CardHeader>

        <CardContent>
          <AttachmentsPreviewGrid />
        </CardContent>
      </Card>
    </>
  );
}
// function useLiveQuery(arg0: () => any) {
//   throw new Error("Function not implemented.");
// }
