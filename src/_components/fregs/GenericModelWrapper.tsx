import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { HTMLAttributes } from "react";

export type GenericModelData = {
  title?: string;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
  css?: string;
};

export const GenericModelContainer = ({
  md,

  setMd,
  className,
}: { md: GenericModelData | null; setMd: (val: GenericModelData | null) => void } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Dialog open={!!md}>
      <DialogContent dir={"rtl"} className={cn(" ", className)}>
        <DialogClose
          onClick={() => setMd(null)}
          className="absolute  left-4 rounded-xs opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader dir="rtl">
          {md?.title && <DialogTitle className="flex">{md.title}</DialogTitle>}
          {md?.description && <DialogDescription>{md.description}</DialogDescription>}
        </DialogHeader>

        {md?.content}
        {md?.footer && <DialogFooter>{md.footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
