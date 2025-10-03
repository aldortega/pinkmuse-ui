import { Link } from "react-router-dom";

export default function NewsFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:gap-6 sm:px-6 sm:text-left">
        <p className="text-sm text-muted-foreground">
          Ac 2025 ArtHub. All Rights Reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
          <Link
            to="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            to="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            to="/contact"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
