
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

// * This function only works on the server side.
async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default getSession;
