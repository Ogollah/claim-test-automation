import { getServerSession } from "next-auth";
import { ModeToggle } from "../mode-toggle";
import { SheetMenu } from "./sheet-menu";
import { UserNav } from "./user-nav";
import { authOptions } from "@/lib/auth";


interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {

  return (
    <header className="bg-green-700 sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center bg-green-900">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className=" px-3 font-bold text-gray-100">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end bg-green-900 space-x-4 lg:space-x-6">
          {/* <ModeToggle /> */}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
