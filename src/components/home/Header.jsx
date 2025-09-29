import { Search, Bell, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="top-0 z-50 w-full  bg-red-50 shadow ">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="size-8 text-white bg-gradient-to-br from-rose-500 via-red-400 to-red-500 rounded-lg flex items-center justify-center">
            <Music />
          </div>
          <a
            href="/home"
            className="text-xl font-bold bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text"
          >
            PinkMuse
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/eventos"
            className="text-slate-800 hover:text-red-400 transition-colors font-medium"
          >
            Eventos
          </a>
          <a
            href="#"
            className="text-slate-800 hover:text-red-400 transition-colors font-medium"
          >
            Entradas
          </a>
          <a
            href="#"
            className="text-slate-800 hover:text-red-400 transition-colors font-medium"
          >
            Merch
          </a>
          <a
            href="#"
            className="text-slate-800 hover:text-red-400 transition-colors font-medium"
          >
            Noticias
          </a>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10 w-64 bg-muted/50"
            />
          </div> */}

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-red-100 cursor-pointer rounded-full"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-br from-rose-500 via-red-400 to-red-500 rounded-full"></span>
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
