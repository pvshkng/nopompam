"use client";

import * as ui from "@/components/ui/_index";
import { ReactNode } from "react";
import Image from "next/image";

export default function NavBarDropdown({
  logout,
  children,
}: {
  logout: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <ui.DropdownMenu>
        <ui.DropdownMenuTrigger className="flex flex-row items-center">
          {children}
        </ui.DropdownMenuTrigger>
        <ui.DropdownMenuContent>
          {/* <ui.DropdownMenuLabel>My Account</ui.DropdownMenuLabel>
          <ui.DropdownMenuSeparator /> */}
          <ui.DropdownMenuItem>
            <ui.Button
              variant={"ghost"}
              onClick={() => {
                logout();
              }}
              className="flex w-full items-center gap-2 leading-none p-0 m-0 font-bold"
            >
              <Image
                src={"/icon/log-out.svg"}
                alt="log-out"
                width={18}
                height={18}
              />
              Logout
            </ui.Button>
          </ui.DropdownMenuItem>
        </ui.DropdownMenuContent>
      </ui.DropdownMenu>
    </>
  );
}
