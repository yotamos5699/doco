import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { FoldersNavigation } from "./_folders/FoldersNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllFilesList } from "./_all_files/AllFilesList";

export function Documents() {
  // const data = useDocumentsStore(useShallow((state) => state.documents));
  return (
    <Card className={`p-0`}>
      <CardContent className="p-0">
        <Tabs defaultValue="all_files" className="w-full" dir="rtl">
          <TabsList className="grid max-w-1/2  grid-cols-2 h-7 p-0 ">
            <TabsTrigger className={`p-0`} value="all_files">
              כל הקבצים
            </TabsTrigger>
            <TabsTrigger className={`p-0`} value="folders">
              סיפריות
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all_files">
            <AllFilesList />
          </TabsContent>
          <TabsContent value="folders">
            <FoldersNavigation />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
