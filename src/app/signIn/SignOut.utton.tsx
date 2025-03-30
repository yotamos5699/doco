"use client";
import { signOut } from "next-auth/react";
import { MdOutlineOfflineBolt } from "react-icons/md";
function SignOutButton() {
  return (
    <button
      className={`flex px-6 p-1 rounded-lg shadow-lg`}
      onClick={async () => {
        await signOut();
      }}
    >
      <MdOutlineOfflineBolt className={`text-red-500 font-bold text-2xl`} />
    </button>
  );
}

export default SignOutButton;
