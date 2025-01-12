"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
function NavbarLink({ title, onClick }) {
  const link = `/${title.toLowerCase()}`;
  const pathname = usePathname();
  const isActive = pathname === link;
  return (
    <div className="relative">
      <Link
        href={link}
        className={`inline-flex items-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-10 px-4 py-2 w-full justify-start text-lg hover:text-foreground text-foreground ${
          isActive ? "" : "opacity-50"
        }`}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      >
        {title}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}
export default NavbarLink;
