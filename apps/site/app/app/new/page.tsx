import { FormButton } from "@local/components/form-button";
import { Heading } from "@local/components/heading";
import { Input } from "@local/components/input";

import { Textarea } from "@local/components/textarea";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MultiSelect } from "~/components/multi-select";
import { getAndValidateUser } from "~/database/auth-adapter";
import type { Collection, Tag } from "~/database/schema";

async function createBookmark(formData: FormData) {
  "use server";

  let url = formData.get("url")?.toString();
  let title = formData.get("title")?.toString();
  let description = formData.get("description")?.toString();
  let tags = formData.get("tags")?.toString();
  let collections = formData.get("collections")?.toString();

  console.log({
    url,
    title,
    description,
    tags,
    collections,
  });

  if (!url) {
    throw new Error("URL is required");
  }

  // TODO: Add your database insertion logic here
  // Example: await db.insert(content).values({ url, title, description });

  revalidatePath("/app");
}

async function listUserCollections(userId: string) {
  return [];
}

async function listUserTags(userId: string) {
  return [];
}

export default async function NewBookmark() {
  const [userResult] = await Promise.allSettled([getAndValidateUser()]);
  if (userResult.status === "rejected" || !userResult.value.user) {
    return redirect("/login");
  }
  let user = userResult.value.user;
  // list collections for the current account
  let [collectionsResult, tagsResult] = await Promise.allSettled([
    listUserCollections(user.id),
    listUserTags(user.id),
  ]);

  let existingCollections =
    collectionsResult.status === "fulfilled" ? collectionsResult.value : [];
  let existingTags = tagsResult.status === "fulfilled" ? tagsResult.value : [];

  return (
    <article className="max-w-[95vw] md:max-w-prose md:w-[65ch] m-auto grow grid grid-cols-1 justify-center">
      <Heading level={2}>Add a new bookmark</Heading>

      <form
        action={createBookmark}
        className="max-w-lg mx-auto w-full space-y-4 mt-8"
      >
        <Input
          label="URL"
          required
          type="url"
          id="url"
          name="url"
          placeholder="https://example.com"
        />

        <Input
          label="Title"
          type="text"
          id="title"
          name="title"
          placeholder="My Awesome Bookmark"
        />

        <Textarea
          label="Description"
          id="description"
          name="description"
          rows={3}
          placeholder="A brief description of this bookmark..."
        />

        <div>
          <label className="mb-2 flex flex-col" htmlFor="collection">
            Collections
          </label>
          <MultiSelect
            name="collections"
            options={existingCollections.map((c: Collection) => ({
              label: c.name,
              value: c.id,
            }))}
          />
        </div>

        <div>
          <label className="mb-2 flex flex-col" htmlFor="tags">
            Tags
          </label>
          <MultiSelect
            name="tags"
            options={existingTags.map((t: Tag) => ({
              label: t.name,
              value: t.id,
            }))}
          />
        </div>

        <FormButton
          variant="primary"
          // className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Bookmark
        </FormButton>
      </form>
    </article>
  );
}
