"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
export const LogOutButton = () => {
  return (
    <div className={``}>
      <Button onPointerDown={() => signOut()} variant={"link"}>
        <LogOut />{" "}
      </Button>
    </div>
  );
};
