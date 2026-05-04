import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type CategoryCardProps = {
  category: {
    id: number;
    name: string;
    count: string;
    icon: LucideIcon;
  };
};

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.name)}`}
      className="group flex cursor-pointer flex-col items-center rounded-sm border border-gray-200 bg-white p-6 text-center transition-all hover:-translate-y-1 hover:border-[#FF9900] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-gray-50 text-gray-900 transition-colors group-hover:bg-[#FF9900] group-hover:text-white">
        <Icon className="h-8 w-8" />
      </div>

      <h3 className="mb-1 font-semibold text-gray-900">{category.name}</h3>

      <p className="text-sm text-gray-500">{category.count} sản phẩm</p>
    </Link>
  );
}