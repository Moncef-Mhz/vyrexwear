import { SelectProduct } from "@/db/schema/product";
import { formatMoney } from "@/lib/utils";
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
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold truncate">{product.title}</h3>
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
