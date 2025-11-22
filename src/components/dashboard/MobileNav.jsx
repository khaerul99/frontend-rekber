"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Wallet } from "lucide-react";
import NavLinks from "./Navlinks";
import UserNav from "./UserNav";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-64 p-4 flex flex-col h-full">
           <SheetTitle className="sr-only">Navigation</SheetTitle>
           
           {/* Logo di Mobile Menu */}
           <div className="flex items-center border-b px-2 pb-4 mb-4">
              <Wallet className="mr-2 h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-slate-900">Rekber App</span>
           </div>

           <div className="flex-1">
             {/* Pass fungsi close biar kalau diklik menu nutup sendiri */}
             <NavLinks onNavigate={() => setIsOpen(false)} />
           </div>

           <UserNav />
        </SheetContent>
      </Sheet>
      
      <span className="text-lg font-bold text-blue-600">Rekber App</span>
    </header>
  );
}