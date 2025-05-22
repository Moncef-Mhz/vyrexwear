import { getCategoryById } from "@/app/actions/categories";
import CategoryPage from "@/components/category/category";
import { PageParamsProps } from "@/types";

const Category = async ({ params }: PageParamsProps) => {
  const { id } = await params;

  if (id === "new") {
    return <CategoryPage />;
  }

  // Parse and validate ID
  const numericId = Number(id);
  if (!isNaN(numericId)) {
    const category = await getCategoryById(numericId);

    if (!category) {
      return <div>Category not found</div>;
    }

    return <CategoryPage category={category} />;
  }

  // Fallback
  return <div>Invalid category ID</div>;
};

export default Category;
