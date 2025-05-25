export type ProductRelation = {
  product_categories: {
    productId: number;
    categoryId: number;
  };
  categories: {
    updated_at: Date | null;
    created_at: Date;
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    is_active: boolean | null;
    position: number | null;
  } | null;
};
