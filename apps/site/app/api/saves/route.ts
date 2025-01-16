import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/database/db";
import { apiKeys } from "~/database/schema";

async function authenticateApiKey(
  request: Request,
): Promise<{ userId: string } | null> {
  let apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    return null;
  }

  let key = await db.query.apiKeys.findFirst({
    where: eq(apiKeys.key, apiKey),
  });

  if (!key) {
    return null;
  }
  if (key.isRevoked) {
    return null;
  }
  if (key.expiresAt && new Date(key.expiresAt) < new Date()) {
    return null;
  }

  // Update last used timestamp
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, key.id));

  return { userId: key.userId };
}

async function checkAuth(
  request: Request,
): Promise<{ userId: string } | NextResponse> {
  let auth = await authenticateApiKey(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { userId: auth.userId };
}

export async function GET(request: Request): Promise<Response> {
  let auth = await checkAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  // Implement your GET logic here using auth.userId
  return NextResponse.json({ message: "Authenticated GET request" });
}

export async function POST(request: Request): Promise<Response> {
  let auth = await checkAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  // Implement your POST logic here using auth.userId
  return NextResponse.json({ message: "Authenticated POST request" });
}

export async function DELETE(request: Request): Promise<Response> {
  let auth = await checkAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  // Implement your DELETE logic here using auth.userId
  return NextResponse.json({ message: "Authenticated DELETE request" });
}

export async function PATCH(request: Request): Promise<Response> {
  let auth = await checkAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  // Implement your PATCH logic here using auth.userId
  return NextResponse.json({ message: "Authenticated PATCH request" });
}
