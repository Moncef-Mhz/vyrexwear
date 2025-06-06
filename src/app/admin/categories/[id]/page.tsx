import { getCategoryById } from "@/app/actions/categories";
import CategoryPage from "@/components/category/category";

type params = Promise<{ id: string }>;

const Category = async ({ params }: { params: params }) => {
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
