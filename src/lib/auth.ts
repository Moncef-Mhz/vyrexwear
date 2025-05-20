import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { account, session, user, verification } from "@/db/schema/user";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      verification,
      account,
      session,
    },
  }),
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      lastName: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});
