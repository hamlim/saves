import { Heading } from "@local/components/heading";
import { Link } from "@local/components/link";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getAndValidateUser } from "~/database/auth-adapter";

export default async function LoginPage({
  searchParams,
}: { searchParams: Promise<{ error?: string }> }) {
  let [userResult, searchParamsResult] = await Promise.allSettled([
    getAndValidateUser(),
    searchParams,
  ]);

  if (userResult.status === "fulfilled") {
    let user = userResult.value;

    // user is logged in already, we can redirect back to the landing page!
    if (user) {
      return redirect("/app");
    }
  }

  let errorParam: string | undefined;
  if (searchParamsResult.status === "fulfilled") {
    errorParam = searchParamsResult.value.error;
  }

  return (
    <article className="grow grid place-items-center">
      <div className="max-w-[100vw] w-[50ch] min-w-xl mx-auto">
        <Heading level={2} className="mb-8">
          Sign in:
        </Heading>
        {errorParam ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorParam.includes("generic_error")
                ? `Something went wrong. Please try again.`
                : errorParam}
            </AlertDescription>
          </Alert>
        ) : null}
        <Link href="/api/auth/login">Sign in with GitHub</Link>
      </div>
    </article>
  );
}
