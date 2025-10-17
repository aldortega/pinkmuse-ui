export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-800 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <span className="font-bold">© {new Date().getFullYear()} PinkMuse</span>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
          <a
            className="font-semibold transition-colors hover:bg-gradient-to-br hover:from-rose-500 hover:via-red-400 hover:to-red-600 hover:text-transparent hover:bg-clip-text"
            href="#"
          >
            Terminos
          </a>
          <a
            className="font-semibold transition-colors hover:bg-gradient-to-br hover:from-rose-500 hover:via-red-400 hover:to-red-600 hover:text-transparent hover:bg-clip-text"
            href="#"
          >
            Privacidad
          </a>
          <a
            className="font-semibold transition-colors hover:bg-gradient-to-br hover:from-rose-500 hover:via-red-400 hover:to-red-600 hover:text-transparent hover:bg-clip-text"
            href="#"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
