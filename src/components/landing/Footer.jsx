export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-10 text-sm text-slate-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-bold">© {new Date().getFullYear()} PinkMuse</span>
        <div className="flex gap-6">
          <a
            className="font-semibold hover:bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:text-transparent hover:bg-clip-text"
            href="#"
          >
            Términos
          </a>
          <a
            className="font-semibold hover:bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:text-transparent hover:bg-clip-text"
            href="#"
          >
            Privacidad
          </a>
          <a
            className="font-semibold hover:bg-gradient-to-br from-rose-500 via-red-400 to-red-600 hover:text-transparent hover:bg-clip-text"
            href="#"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
