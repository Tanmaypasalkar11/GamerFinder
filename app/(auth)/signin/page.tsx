import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";


export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  // google oauth pe leke jayega re ye
  redirect("/api/auth/signin/google");
}