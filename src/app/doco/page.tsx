import { Tabs } from "@/components/ui/tabs";
import { TabsNavigation } from "./_tabs/TabsNavigation";
import { TabsContent_ } from "./_tabs/TabsContent_";

export default function page() {
  return (
    <Tabs defaultValue={"documents"} dir="rtl" className="w-full">
      <TabsNavigation />
      <TabsContent_ />
    </Tabs>
  );
}
