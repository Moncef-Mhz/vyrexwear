import { db } from "@/db";
import { collections, NewCollection } from "@/db/schema/collections";

export const getCollections = async () => {
  try {
    const res = await db.select().from(collections);

    return { res, success: "Collections fetched successfully" };
  } catch (err) {
    console.error("Error fetching collections:", err);
  }
};

export const createCollection = async (data: NewCollection) => {
  try {
    const { title, description, imageUrl, slug } = data;

    if (!title || !slug) {
      throw new Error("Title and Slug are requierd");
    }

    const NewCollection: NewCollection = {
      title,
      slug,
      description,
      imageUrl,
    };

    const res = await db.insert(collections).values(NewCollection).returning();

    return { res, success: "Collection created successfully!" };
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};
