import { redirect } from "next/navigation";

// KB list is at /dashboard — this route group page is unused but kept to avoid Next.js warnings
export default function AppGroupRoot() {
  redirect("/dashboard");
}
