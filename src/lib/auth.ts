import { supabase } from "./supabase";

export async function getCurrentUserId(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.user) {
    throw new Error("You must be logged in to perform this action.");
  }

  return session.user.id;
}
