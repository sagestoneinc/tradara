import { redirect } from "next/navigation";

export default function LegacyPrivacyPage(): never {
  redirect("/legal/privacy-policy");
}
