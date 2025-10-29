import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/merch";

export default function ProductCard({ title, price, image, slug }) {
  const formattedPrice = typeof price === "number" ? formatCurrency(price) : price;
  const href = slug ? `/merch/${slug}` : "/merch";

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-red-50">
      <div className="aspect-square relative overflow-hidden bg-muted/60">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-800 mb-2 text-balance">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold bg-gradient-to-br from-rose-500 via-red-400 to-red-500 text-transparent bg-clip-text">
            {formattedPrice}
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="hover:bg-red-400 hover:text-white hover:border-none transition-colors bg-transparent cursor-pointer"
          >
            <Link to={href}>Ver producto</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
