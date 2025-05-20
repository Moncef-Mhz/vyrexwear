import { user } from "@/db/schema/user";

export type NewUserType = Omit<
  typeof user.$inferSelect,
  "emailVerified" | "updatedAt"
> & { password: string };

export type LoginType = {
  email: string;
  password: string;
};

export type SelectUser = typeof user.$inferSelect;
