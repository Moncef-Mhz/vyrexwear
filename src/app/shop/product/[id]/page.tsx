import { getProductbyId } from "@/app/actions/products";
import ProductDetails from "@/components/product/product-details";
import { IdParam } from "@/types/products";

const Product = async ({ params }: { params: IdParam }) => {
  const { id } = await params;

  const productId = Number(id);
  if (isNaN(productId)) {
    return <div>Invalid product ID</div>;
  }

  const productDetail = await getProductbyId(productId);

  if (!productDetail || productDetail.error || !productDetail.product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={productDetail.product} />;
};
export default Product;
