import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
      throw new Error("Unauthorized");
  }
  return session;
}