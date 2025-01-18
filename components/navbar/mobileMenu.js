"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { ThemeSwitcherBtn } from "../ThemeSwitcherBtn";
import { UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import NavbarLink from "./navbarLink";
import Logo from "../Logo";
import { useState } from "react";
function MobileMenu() {
  const [isOpen, SetIsOpen] = useState(false);
  return (
    <div className="md:hidden flex w-full justify-between p-2 border-b-2">
      <div className="flex gap-2">
        <Sheet open={isOpen} onOpenChange={SetIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-4/5">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
              <SheetDescription>
                <div className="flex flex-col gap-3">
                  <NavbarLink
                    title="Dashboard"
                    onClick={() => SetIsOpen(!open)}
                  />
                  <NavbarLink
                    title="Transactions"
                    onClick={() => SetIsOpen(!open)}
                  />
                  <NavbarLink title="Manage" onClick={() => SetIsOpen(!open)} />
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <Logo mobile={true} />
      </div>
      <div className="flex gap-2 items-center">
        <ThemeSwitcherBtn />
        <UserButton />
      </div>
    </div>
  );
}
export default MobileMenu;
