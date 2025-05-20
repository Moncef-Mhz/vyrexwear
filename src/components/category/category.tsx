"use client";

import { SelectCategory } from "@/db/schema/categories";

const CategoryPage = (category: { category?: SelectCategory }) => {
  console.log(category);

  return <div>CategoryPage</div>;
};
export default CategoryPage;
