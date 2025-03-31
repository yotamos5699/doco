"use client";

import { Button } from "@/components/ui/button";
import { useFoldersExplorerStore } from "../../SessionCache";
import { useShallow } from "zustand/react/shallow";

// import { getGmailLabelsAndGroups } from "../doco/_utils/save_file_utils/getGmailLabelsAndGroups";

const toggleId = (id?: string | null) => {
  const ids = useFoldersExplorerStore.getState().discludedLabels;
  if (!id) return;
  const exist = ids.includes(id);
  if (exist) {
    useFoldersExplorerStore.setState({ discludedLabels: ids.filter((id_) => id_ !== id) });
    return;
  }
  useFoldersExplorerStore.setState({ discludedLabels: [...ids, id] });
};

const limits = [10, 30, 50, 100, 500, 1000];

export default function LabelsAndGroups() {
  // const labels = await getGmailLabelsAndGroups();

  const labels = useFoldersExplorerStore((state) => state.labels);
  const discluded = useFoldersExplorerStore(useShallow((state) => state.discludedLabels));
  const currentLimit = useFoldersExplorerStore((state) => state.maxResults);
  console.log({ labels });
  return (
    <div className={`flex flex-col  gap-10 px-3 pt-7`}>
      {/* <div className={`flex`}>{labels.map((l) => l.name)}</div> */}
      <div className={`flex flex-col  gap-2`}>
        <h2 className={` top-0 right-0 border-b border-slate-400/60  text-xs`}>מקסימום מסמכים</h2>
        <div className={`flex flex-wrap relative gap-2 `}>
          {limits.map((l) => (
            <Button
              key={l}
              onPointerDown={() => useFoldersExplorerStore.setState({ maxResults: l })}
              variant={"outline"}
              className={`h-6 text-xs ${currentLimit !== l && "opacity-60"}`}
            >
              {l}
            </Button>
          ))}
        </div>
      </div>
      <div className={`flex flex-col  gap-2`}>
        <h2 className={` top-0 right-0 border-b border-slate-400/60 text-xs`}>תיבות מייל</h2>
        <div className={`flex flex-wrap relative  gap-2  `}>
          {labels.map((l) => (
            <Button
              key={l.id}
              onPointerDown={() => toggleId(l.id)}
              variant={"outline"}
              className={`h-6 text-xs ${l.id && discluded.includes(l.id) && "opacity-60"}`}
            >
              {getLabelName(l.id ?? "", l.name ?? "")}
            </Button>
          ))}
        </div>
      </div>
      <SearchesStats />
    </div>
  );
}
const SearchesStats = () => {
  const d = useFoldersExplorerStore.getState().lastSynced;
  return (
    <div className={`flex w-full items-center  gap-6  pt-6`}>
      <div className={`flex items-center gap-1`}>
        <span className={`text-[10px] opacity-80`}>אחרון שנבדק</span>
        <span className={`text-xs`}>{d?.range?.to} 24/2/2025</span>
      </div>
      <div className={`w-[2px] h-3 opacity-75  bg-slate-800 dark:bg-slate-200`} />
      <div className={`flex items-center gap-1`}>
        <span className={`text-[10px] opacity-80`}>בוצע ב</span>
        <span className={`text-xs`}>{d?.action}24/2/2025</span>
      </div>
    </div>
  );
};
const getLabelName = (id: string, name: string) => {
  const mapedValue = labelsMap.get(id);
  if (!mapedValue) return name;
  return mapedValue.name;
};
const labelsMap = new Map<string, { name: string; show: boolean; default: boolean }>([
  ["CHAT", { name: "צ'אטים", default: true, show: true }],
  ["SENT", { name: "נשלח", default: true, show: true }],
  ["INBOX", { name: "דואר נכנס", default: true, show: true }],
  ["IMPORTANT", { name: "חשןב", default: true, show: true }],
  ["TRASH", { name: "אשפה", default: true, show: true }],
  ["DRAFT", { name: "טיוטות", default: true, show: true }],
  ["SPAM", { name: "ספאם", default: true, show: true }],
  ["CATEGORY_FORUMS", { name: "פורומים", default: true, show: true }],
  ["CATEGORY_UPDATES", { name: "עדכונים", default: true, show: true }],
  ["CATEGORY_PERSONAL", { name: "אישי", default: true, show: true }],
  ["CATEGORY_PROMOTIONS", { name: "קידומי מכירות", default: true, show: true }],
  ["CATEGORY_SOCIAL", { name: "רשתות חברתיות", default: true, show: true }],
  ["STARRED", { name: "מסומן בכוכב", default: true, show: true }],
  ["UNREAD", { name: "לא נקרא", default: true, show: true }],
]);
const labelsArray = [
  {
    id: "CHAT",
    name: "CHAT",
    type: "system",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "SENT",
    name: "SENT",
    type: "system",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "INBOX",
    name: "INBOX",
    type: "system",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "IMPORTANT",
    name: "IMPORTANT",
    type: "system",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "TRASH",
    name: "TRASH",
    type: "system",
    labelListVisibility: "labelHide",
    messageListVisibility: "hide",
  },
  {
    id: "DRAFT",
    name: "DRAFT",
    type: "system",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "SPAM",
    name: "SPAM",
    type: "system",
    labelListVisibility: "labelHide",
    messageListVisibility: "hide",
  },
  {
    id: "CATEGORY_FORUMS",
    name: "CATEGORY_FORUMS",
    type: "system",
  },
  {
    id: "CATEGORY_UPDATES",
    name: "CATEGORY_UPDATES",
    type: "system",
  },
  {
    id: "CATEGORY_PERSONAL",
    name: "CATEGORY_PERSONAL",
    type: "system",
  },
  {
    id: "CATEGORY_PROMOTIONS",
    name: "CATEGORY_PROMOTIONS",
    type: "system",
  },
  {
    id: "CATEGORY_SOCIAL",
    name: "CATEGORY_SOCIAL",
    type: "system",
  },
  {
    id: "STARRED",
    name: "STARRED",
    type: "system",
    labelListVisibility: "labelHide",
    messageListVisibility: "hide",
  },
  {
    id: "UNREAD",
    name: "UNREAD",
    type: "system",
  },
  {
    id: "Label_1",
    name: "Notes",
    type: "user",
    labelListVisibility: "labelShow",
    messageListVisibility: "show",
  },
  {
    id: "Label_2",
    name: "אישי",
    type: "user",
    labelListVisibility: "labelShow",
    messageListVisibility: "show",
  },
  {
    id: "Label_4",
    name: "עבודה",
    type: "user",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "Label_5",
    name: "קבלות",
    type: "user",
    labelListVisibility: "labelShow",
    messageListVisibility: "hide",
  },
  {
    id: "Label_6",
    name: "Junk",
    type: "user",
  },
];
