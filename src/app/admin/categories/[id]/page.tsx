import { getCategoryById } from "@/app/actions/categories";
import CategoryPage from "@/components/category/category";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

const Category = async ({ params }: CategoryPageProps) => {
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

    return <div>Update Category: {category.id}</div>;
  }

  // Fallback
  return <div>Invalid category ID</div>;
};

export default Category;
