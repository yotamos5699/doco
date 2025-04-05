import { getServerSession } from "next-auth";
import { options } from "../app/api/auth/[...nextauth]/options";

async function UserData({ onlyImg }: { onlyImg?: boolean }) {
  const session = await getServerSession(options);
  // console.log({ userDataSession: session });
  if (!session) return null;
  if (onlyImg) return <img className="rounded-full p-1" height={32} width={32} src={session.user?.image ?? ""} alt="" />;
  return (
    <div className={`flex px-2 gap-2`}>
      <img className="rounded-lg" height={20} width={20} src={session.user?.image ?? ""} alt="" />
      <p className="text-xs opacity-50">{session.user?.name}</p>
    </div>
  );
}

export default UserData;
