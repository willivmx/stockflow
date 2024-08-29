import Logo from "@/components/logo";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/dashboard");
}
