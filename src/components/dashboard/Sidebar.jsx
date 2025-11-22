import { Wallet } from "lucide-react";
import NavLinks from "./Navlinks";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-white p-4 md:flex fixed h-full z-10">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-2 mb-4">
        <Wallet className="mr-2 h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold text-slate-900">Rekber App</span>
      </div>

      {/* Menu */}
      <div className="flex-1">
        <NavLinks />
      </div>

    
    </aside>
  );
}