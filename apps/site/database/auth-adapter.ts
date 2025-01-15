import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { GitHub } from "arctic";
import { Lucia } from "lucia";
import type { Session, User } from "lucia";
import { cookies } from "next/headers";
import { db } from "./db";
import { sessions, users } from "./schema";

export let adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export let lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.githubId,
      username: attributes.username,
      avatarURL: attributes.avatarURL,
      name: attributes.name,
      email: attributes.email,
    };
  },
});

export interface DatabaseUserAttributes {
  id: string;
  createdAt: string;
  username: string;
  githubId: string;
  avatarURL: string;
  name: string;
  email: string;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

export async function getAndValidateUser(): Promise<
  { user: User; session: Session } | { user: null; session: null }
> {
  let cookieStore = await cookies();
  let sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  let result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result?.session?.fresh) {
      let sessionCookie = lucia.createSessionCookie(result.session.id);
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      let sessionCookie = lucia.createBlankSessionCookie();
      cookieStore.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
}

function getRedirectURL() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api/auth/callback";
  }
  // @TODO - support preview deploy auth!
  return "https://saves.vercel.app/api/auth/callback";
}

let redirectURL = getRedirectURL();

export let github = new GitHub(
  process.env.GITHUB_AUTH_CLIENT_ID,
  process.env.GITHUB_AUTH_SECRET,
  redirectURL,
);
