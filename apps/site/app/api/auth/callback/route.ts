import { OAuth2RequestError } from "arctic";

import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { github, lucia } from "~/database/auth-adapter";
import { db } from "~/database/db";
import { users } from "~/database/schema";
import { StdLogger } from "~/lib/std-logger";

let logger = new StdLogger("auth-callback");

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  let cookieStore = await cookies();
  let url = new URL(request.url);
  let code = url.searchParams.get("code");
  let state = url.searchParams.get("state");
  let storedState = cookieStore.get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    redirect("/login?error=invalid_state");
  }

  // Cleanup login state cookie
  cookieStore.delete("github_oauth_state");

  try {
    let tokens = await github.validateAuthorizationCode(code);
    let githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });
    let githubUser: GitHubUser = await githubUserResponse.json();

    if (githubUser.login !== "hamlim") {
      return new Response(null, {
        status: 403,
      });
    }

    let existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.githubId, githubUser.id),
    });

    if (existingUser) {
      let session = await lucia.createSession(existingUser.id, {});
      let sessionCookie = lucia.createSessionCookie(session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/app",
        },
      });
    }

    let userId = generateIdFromEntropySize(10); // 16 characters long

    try {
      await db.transaction(async (tx) => {
        try {
          await tx.insert(users).values({
            id: userId,
            githubId: githubUser.id,
            username: githubUser.login,
            avatarURL: githubUser.avatar_url,
            name: githubUser.name,
            email: githubUser.email,
          });
        } catch (e) {
          logger.error({
            message: "Error creating user",
            error: e as Error,
            full: true,
          });
        }
      });
    } catch (error) {
      logger.error({
        message: "Error creating user",
        error: error as Error,
        full: true,
      });
    }

    let session = await lucia.createSession(userId, {});
    let sessionCookie = lucia.createSessionCookie(session.id);
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/app",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    logger.error({
      message: "Caught unknown error",
      error: e as Error,
      full: true,
    });
    redirect("/login?error=general_failure");
  }
}

interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}
