// import { Card } from "@/components/ui/card";
import { UpperMenubar } from "./menu_bar/UpperMenubar";
import { TabsNavigation } from "@/_doco/_tabs/TabsNavigation";

export const UpperNav = () => {
  return (
    <div className={`flex w-full justify-between `}>
      <TabsNavigation />
      <UpperMenubar />
    </div>
  );
};
