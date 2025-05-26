import { SelectProduct } from "@/db/schema/product";
import { formatMoney } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: { product: SelectProduct }) => {
  const router = useRouter();

  const productImage =
    (product.images_by_color &&
      Object.values(product.images_by_color)[0]?.[0]) ??
    "";

  const handleClick = () => {
    router.push(`/shop/product/${product.id}`);
  };

  return (
    <div
      className="w-full h-full cursor-pointer transition"
      onClick={handleClick}
    >
      <div className="overflow-hidden rounded-md">
        <Image
          src={productImage}
          alt={product.title}
          width={300}
          height={300}
          className="w-full h-[350px] object-cover transform hover:scale-105 transition duration-200"
        />
      </div>
      <div className="mt-2 flex flex-col gap-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base  truncate">{product.title}</h3>
        </div>
        <div>
          <StarRating rating={product.reviews_count ?? 0} />
        </div>
        <div>
          <span className="text-sm font-bold text-gray-800">
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
