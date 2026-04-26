import { redirect } from "next/navigation";

export default function LegacyTermsPage(): never {
  redirect("/legal/terms");
}
