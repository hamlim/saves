import { generateState } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { github } from "~/database/auth-adapter";

export async function GET(_request: Request): Promise<Response> {
  // Exit early so we don't create a mismatched `state` cookie
  if (_request.headers.get("next-router-prefetch")) {
    return new Response(null, {
      status: 204,
    });
  }

  const cookieStore = await cookies();

  const state = generateState();

  const url = github.createAuthorizationURL(state, []);

  // store state as cookie
  cookieStore.set("github_oauth_state", state, {
    secure: process.env.NODE_ENV === "development", // set to false in localhost
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return redirect(url.toString());
}
