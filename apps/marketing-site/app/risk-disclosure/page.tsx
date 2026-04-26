import { redirect } from "next/navigation";

export default function LegacyRiskPage(): never {
  redirect("/legal/risk-disclaimer");
}
