import { useShallow } from "zustand/react/shallow";
import Image from "next/image";
import { User } from "lucide-react";
import { useDocoSessionStore } from "@/_doco/SessionCache";
export const UserImage = () => {
  const session = useDocoSessionStore(useShallow((state) => state.session));
  const image_ = session?.user?.image;
  return <div className={`relative w-4 h-4 rounded-full`}>{image_ ? <Image src={image_} alt="" fill /> : <User />}</div>;
};
