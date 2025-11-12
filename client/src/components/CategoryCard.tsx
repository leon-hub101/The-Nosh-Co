import { Link } from "wouter";
import { Nut, Apple, Candy, Sprout, LucideIcon } from "lucide-react";
import type { CategoryInfo } from "@/hooks/useProducts";

interface CategoryCardProps {
  category: CategoryInfo;
}

const categoryIcons: Record<string, LucideIcon> = {
  "nuts": Nut,
  "dried-fruit": Apple,
  "sweets-gummies": Candy,
  "seeds-baking": Sprout,
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.slug] || Nut;

  return (
    <Link href={`/category/${category.slug}`}>
      <div
        className="group bg-white border border-card-border p-8 hover-elevate active-elevate-2 transition-all cursor-pointer overflow-visible"
        data-testid={`category-card-${category.slug}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 mb-6 flex items-center justify-center bg-stone-50 border border-card-border">
            <Icon className="w-10 h-10 text-foreground" />
          </div>
          
          <h3 className="text-2xl font-serif font-light tracking-wide text-foreground mb-3">
            {category.name}
          </h3>
          
          <p className="text-sm font-sans text-gray-600 mb-6">
            {category.description}
          </p>
          
          <div className="text-sm font-sans tracking-widest uppercase text-foreground group-hover:underline">
            Shop Now
          </div>
        </div>
      </div>
    </Link>
  );
}
