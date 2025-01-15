"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAndValidateUser, lucia } from "~/database/auth-adapter";

export async function logout(): Promise<{
  error: string;
}> {
  const { session } = await getAndValidateUser();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  let cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
}
