import { SelectCategory } from "./../db/schema/categories";
export type ChildCategories = SelectCategory & {
  parent: SelectCategory | null;
};
