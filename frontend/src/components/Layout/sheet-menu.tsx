import Link from "next/link";
import { LayoutDashboard, MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";
import { Menu } from "./menu";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col bg-green-900" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1 decoration-none w-full"
            variant="link"
            asChild
          >
            <Link href="/" className="flex items-center gap-2 decoration-none text-gray-100">
              <LayoutDashboard className="h-6 w-6 mr-1 text-gray-100" />
              <SheetTitle className="font-bold text-lg text-gray-100">CBTS</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
