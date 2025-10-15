import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Music, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-red-50 shadow">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex flex-shrink-0 items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
            <Music className="h-5 w-5" />
          </div>
          <Link
            to="/home"
            className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-xl font-bold text-transparent"
          >
            PinkMuse
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          <Link
            to="/eventos"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Eventos
          </Link>
          <Link
            to="/entradas"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Entradas
          </Link>
          <Link
            to="/merch"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Merch
          </Link>
          <Link
            to="/noticias"
            className="text-sm font-medium text-slate-800 transition-colors hover:text-red-400"
          >
            Noticias
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-red-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-gradient-to-br from-rose-500 via-red-400 to-red-500" />
          </Button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="rounded-full outline-hidden transition hover:ring-2 hover:ring-red-200 focus-visible:ring-2 focus-visible:ring-red-300"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/user-avatar.jpg" alt="Sarah" />
                <AvatarFallback className="bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-white">
                  A
                </AvatarFallback>
              </Avatar>
            </button>

            {isMenuOpen ? (
              <div className="absolute left-1/2 mt-2 w-35 -translate-x-1/2 rounded-lg border border-slate-200 bg-red-50 p-2 text-center shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
