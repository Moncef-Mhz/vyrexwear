// types/better-auth.d.ts
import "better-auth";

declare module "better-auth" {
  interface User {
    firstName: string | null;
    lastName: string | null;
  }
}
