import { Card } from "@/components/ui/card";
import { Documents } from "./Documents";
import { unstable_cacheTag } from "next/cache";

// export const dynamic = "force-static";
export default async function page() {
  "use cache";
  unstable_cacheTag("documents");
  // const session = await getServerSession(options);
  // if (!session) return <SignInPage />;
  return (
    <Card>
      {/* <h1 className={`text-6xl`}>{tabValue}</h1> */}
      <Documents />
    </Card>
  );
}
