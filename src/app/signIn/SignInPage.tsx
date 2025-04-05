import ThemeSelector from "@/_components/ThemeSelector";
import { AuthButton } from "./SignInButton";
import { BotIcon, DogIcon } from "lucide-react";

export const SignInPage = () => {
  // const session = await getServerSession(options);
  //
  return (
    <div className={`flex min-h-screen flex-col  items-center justify-evenly `}>
      <div className="gap-8 flex flex-col justify-center items-center ">
        <button className={``}>
          <ThemeSelector />
        </button>
        <div className={`grid grid-cols-2 gap-4 `}>
          <BotIcon className={`opacity-70`} size={44} /> <DogIcon className={`opacity-70`} size={44} />
        </div>
        <div className="z-10 w-full  items-center justify-center font-mono text-sm lg:flex">
          <AuthButton />
        </div>
      </div>
    </div>
  );
};
