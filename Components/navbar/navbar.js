import { UserButton } from "@clerk/nextjs";
import Logo from "../Logo";
import NavbarLink from "./navbarLink";
import { ThemeSwitcherBtn } from "../ThemeSwitcherBtn";

import MobileMenu from "./mobileMenu";
function Navbar() {
  return (
    <>
      <MobileMenu />
      <div className="hidden border-separate border-b bg-background md:block py-5">
        <div className="container flex items-center justify-between px-12">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="flex items-center">
              <NavbarLink title="Dashboard" />
              <NavbarLink title="Transactions" />
              <NavbarLink title="Manage" />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <ThemeSwitcherBtn />
            <UserButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
