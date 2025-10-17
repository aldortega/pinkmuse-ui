import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const DESCRIPTION_LIMIT = 100;

const truncate = (text, limit) => {
  if (!text) {
    return "";
  }
  if (text.length <= limit) {
    return text;
  }
  return `${text.slice(0, limit - 1)}...`;
};

export default function NewsCard({ article }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(article.link);
  };

  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer bg-red-50"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <p className="text-xs font-bold bg-gradient-to-br from-rose-500 via-red-400 to-red-500 bg-clip-text text-transparent uppercase tracking-wide ">
          {article.date}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-slate-800 sm:text-xl">
          {article.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {truncate(article.description, DESCRIPTION_LIMIT)}
        </p>
      </CardContent>
    </Card>
  );
}
