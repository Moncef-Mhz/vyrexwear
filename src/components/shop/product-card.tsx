import { SelectProduct } from "@/db/schema/product";
import { formatMoney } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductCard = ({ product }: { product: SelectProduct }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Get first and second image (if exists)
  const images =
    (product.images_by_color && Object.values(product.images_by_color)[0]) ||
    [];

  const productImage = images[0] ?? "";
  const hoverImage = images[1] ?? images[0] ?? "";

  const handleClick = () => {
    router.push(`/shop/product/${product.id}`);
  };

  return (
    <div
      className="w-full h-full group cursor-pointer transition"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-[400px] lg:h-[450px] xl:h-[650px]">
        <Image
          src={hovered ? hoverImage : productImage}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw,
           (max-width: 1200px) 50vw,
           33vw"
        />
      </div>
      <div className="mt-2 flex flex-col items-start">
        <div className="flex items-center">
          <h3 className="text-base font-medium truncate">{product.title}</h3>
        </div>
        <div>
          <span className="text-sm font-regular text-muted-foreground">
            {formatMoney(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;

export const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i <= fullStars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    );
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-sm text-muted-foreground">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};
