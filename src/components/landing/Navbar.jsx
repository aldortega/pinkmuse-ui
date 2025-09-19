import { Button } from "../ui/button";

export default function NavBar() {
  return (
    <header className="flex items-center justify-between w-full px-6 py-5 mx-auto ">
      <div className="flex items-center justify-center w-32 h-10 rounded-xl">
        <h1 className="text-2xl font-bold text-transparent bg-gradient-to-br from-rose-500 via-red-400 to-red-600 bg-clip-text">
          PinkMuse
        </h1>
      </div>
      <nav className="hidden gap-6 text-sm font-medium md:flex text-slate-800">
        <a
          className="hover:bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:text-transparent hover:bg-clip-text"
          href="#features"
        >
          Características
        </a>
        <a
          className="hover:bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:text-transparent hover:bg-clip-text"
          href="#testimonials"
        >
          Comunidad
        </a>
        <a
          className="hover:bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:text-transparent hover:bg-clip-text"
          href="#cta"
        >
          Comenzar
        </a>
      </nav>
      <Button className="px-4 py-2 text-sm font-semibold text-white shadow-sm bg-gradient-to-br from-rose-500 via-red-400 to-red-500 hover:bg-pink-700 cursor-pointer">
        Ingresar
      </Button>
    </header>
  );
}
