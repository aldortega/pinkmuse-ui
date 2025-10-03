import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function NewsHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#E74C3C]">
              <span className="text-lg font-bold text-[#E74C3C]">i</span>
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">
              ArtHub
            </span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start md:flex">
            <Link
              to="/"
              className="font-medium transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="font-medium transition-colors hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              to="/create"
              className="font-medium transition-colors hover:text-foreground"
            >
              Create
            </Link>
            <Link to="/news" className="font-medium text-[#E74C3C]">
              News
            </Link>
          </nav>
        </div>
        <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <div className="relative w-full max-w-md sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-colors focus:border-gray-300 focus:outline-none"
            />
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <img
              src="/abstract-profile.png"
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
