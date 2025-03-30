import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { NewAttachmentsData } from "../attachments/_utils/getNewAttachmentsData";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Circle, Files, Mail, User, Weight } from "lucide-react";
import { CbInput } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useShallow } from "zustand/react/shallow";
import { GetNewAttachmentsFilesButton } from "../attachments/_components/_buttons/GetNewAttachmentsMetaButtons";
import { useAttachmentsMetaStore } from "../_stores/attachments_stores/useAttachmentsMetaStore";
const mailStyle_ = { d: "flex w-full items-center  gap-2", v: "flex items-center   text-nowrap" };
export const EmailsMetaPreviewTable = ({ meta }: { meta: NewAttachmentsData }) => {
  // const extended = useAttachmentsMetaStore(useShallow((state) => state.expended));
  // const toggleExpended = useAttachmentsMetaStore().toggleExpended;

  return (
    <div className={`flex flex-col justify-between  h-full min-h-[90%] overflow-auto `}>
      <div>
        {meta.map((data, idx) => (
          <Card key={data.emailData.id} className={`p-2`}>
            <Accordion type="single" collapsible>
              <AccordionItem
                // className="flex"
                // id={data.emailData.id ?? ""}
                value={data.emailData.id}
              >
                <div className={mailStyle_.d}>
                  <MailDataRow data={data} />

                  <AccordionTrigger
                    className={`${mailStyle_.v} w-1/12`}
                    // onPointerDown={(e) => toggleExpended(data.emailData.id ?? "")}
                  />
                </div>
                {/* </AccordionTrigger> */}
                <AccordionContent>
                  <NewEmailsContent data={data} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))}
      </div>
      <DialogFooter className={`flex p-4`}>
        <GetNewAttachmentsFilesButton />
      </DialogFooter>
    </div>
  );
};

const MailDataRow = ({ data }: { data: NewAttachmentsData[number] }) => {
  const toggleSelections = useAttachmentsMetaStore().toggleSelections;
  const selections = useAttachmentsMetaStore().selections;
  return (
    <>
      <div className={`${mailStyle_.v} w-4/12`}>
        <User size={16} />
        <span className={`flex w-10/12 overflow-clip`}>{data.emailData.fromName}</span>
      </div>
      <div className={`${mailStyle_.v} w-3/12`}>
        <Mail size={16} />
        <span className={`flex w-10/12 overflow-clip`}> {data.emailData.fromEmail}</span>
      </div>
      <div className={`${mailStyle_.v} w-2/12`}>
        <Weight size={16} />
        <span className={`flex w-9/12 overflow-clip`}> {(Number(data.emailData.sizeEstimate) / 1000000).toFixed(2)}MB</span>
      </div>
      <div className={`${mailStyle_.v} w-1/12  `}>
        <Files size={16} />
        <span className={`${mailStyle_.v} w-10/12`}>
          {data.emailData.filesAmount}/{data.emailData.filesExists}
        </span>
      </div>
      <div className={`${mailStyle_.v} w-1/12`}>
        <CbInput
          disabled={!!!(data.emailData.filesAmount - data.emailData.filesExists)}
          checked={selections.has(data.emailData.id ?? "")}
          onChange={() => toggleSelections(data.emailData.id)}
        />
      </div>
    </>
  );
};

const NewEmailsContent = ({ data }: { data: NewAttachmentsData[number] }) => {
  const toggleSelections = useAttachmentsMetaStore().toggleSelections;
  const selections = useAttachmentsMetaStore((state) => state.selections);

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className={`opacity-80 border-b p-1`}>{data.emailData.subject}</AccordionTrigger>
          <AccordionContent>
            <div className={`text-sm opacity-70 p-1`}>{data.emailData.snippet}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Table className={`flex flex-col w-full `}>
        <TableHeader>
          <TableRow className={`flex  min-w-full border-2 `}>
            <TableHead className={`w-7/12 flex items-center justify-center text-center`}>שם</TableHead>
            <TableHead className={`w-3/12  flex items-center justify-center text-center`}>גודל</TableHead>
            <TableHead className={`w-1/12  flex items-center justify-center text-center`}>נשמר</TableHead>

            <TableHead className={`w-1/12  flex items-center justify-center text-center`}>כלול</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className={`${!selections.has(data.emailData.id ?? "") ? "pointer-events-none opacity-60" : ""}`}>
          {data.attachments?.map((att) => {
            return (
              <TableRow className={`flex`} key={att.attachmentId}>
                <TableCell className={`w-7/12 flex items-center justify-center text-center`}>{att.fileName}</TableCell>
                <TableCell className={`w-3/12  flex items-center justify-center text-center`}>{att.sizeEstimate}</TableCell>
                <TableCell className={`w-1/12  flex items-center justify-center text-center`}>
                  {att.exists ? <CheckCircle /> : <Circle />}
                </TableCell>

                <TableCell className={`w-1/12  flex items-center justify-center text-center`}>
                  <CbInput
                    disabled={att.exists}
                    checked={selections.has(att.attachmentId)}
                    onChange={() => toggleSelections(att.attachmentId)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
