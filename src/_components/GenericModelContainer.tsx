import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { HTMLAttributes } from "react";

export type GenericModelData = {
  title?: string;
  description?: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
};

export const GenericModelContainer = ({
  md,
  modelName,
  setModelName,
  className,
  ...props
}: { md: GenericModelData; modelName: any; setModelName: any } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Dialog open={!!modelName}>
      <DialogContent dir={"rtl"} className={cn(" z-50  sm:max-w-[425px] lg:max-w-[580px]", className)}>
        <DialogClose
          onClick={() => setModelName(null)}
          className="absolute  left-4 rounded-xs opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="flex  " dir="rtl">
          {md?.title && <DialogTitle className=" text-start">{md.title}</DialogTitle>}
          {md?.description && <DialogDescription className="">{md.description}</DialogDescription>}
        </DialogHeader>

        {md?.content}
        {md?.footer && <DialogFooter>{md.footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export const NewGenericModelContainer = ({
  md,

  setMd,
  disableClose,
  className,
}: { md: GenericModelData | null; setMd: (val: any | null) => void; disableClose?: boolean } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Dialog open={!!md}>
      {md && (
        <DialogContent dir={"rtl"} className={cn("flex flex-col z-50 w-full max-w-[425px] md:max-w-[640px] lg:max-w-[800px]", className)}>
          {!disableClose && (
            <DialogClose
              onClick={() => setMd(null)}
              className="absolute  left-4 rounded-xs opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}

          <DialogHeader className={`${!md?.title && !md?.description && "hidden"} `} dir="rtl">
            <DialogTitle className={`${!md?.title && "hidden"} flex`}>{md?.title}</DialogTitle>
            <DialogDescription className={`${!md.description && "hidden"}`}>{md?.description}</DialogDescription>
          </DialogHeader>

          {md?.content}
          {md?.footer && <DialogFooter>{md.footer}</DialogFooter>}
        </DialogContent>
      )}
    </Dialog>
  );
};
