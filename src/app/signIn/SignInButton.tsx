"use client";
import { signIn } from "next-auth/react";

export const AuthButton: React.FC = () => {
  // const setScreen = useScreensStore().setScreen;
  // const router = useRouter();

  return (
    <div className="flex flex-col  items-center justify-center gap-4">
      <button
        className="rounded-full shadow-lg   px-10 py-3 font-semibold   transition dark:hover:bg-white/20 bg-opacity-70 hover:bg-opacity-100"
        type="button"
        onClick={async () => {
          // setScreen("main");
          await signIn();
          // router.push("/");
        }}
      >
        {"התחבר"}
      </button>
    </div>
  );
};
