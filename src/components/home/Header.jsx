import { Bell, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-red-50 shadow">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
            <Music className="h-5 w-5" />
          </div>
          <a
            href="/home"
            className="text-xl font-bold text-transparent bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text"
          >
            PinkMuse
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <a
            href="/eventos"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Eventos
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Entradas
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Merch
          </a>
          <a
            href="/noticias"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Noticias
          </a>
        </nav>

        {/* Right side actions */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-red-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-br from-rose-500 via-red-400 to-red-500"></span>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/user-avatar.jpg" alt="Sarah" />
            <AvatarFallback className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default Header;
