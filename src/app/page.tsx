"use client";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();
  console.log(data);
  return <div>welcome</div>;
}
