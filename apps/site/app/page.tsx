import { Heading } from "@local/components/heading";
import { Text } from "@local/components/text";
import { cn } from "@local/utils/cn";

export default async function Home() {
  return (
    <article className="grow grid grid-cols-1 justify-center text-center">
      <section
        className={cn(
          "pt-[20svh] relative",
          "before:bg-no-repeat overflow-clip before:mx-auto before:w-screen before:h-[80vh] before:bg-blend-hue dark:before:bg-blend-darken before:top-1/2 before:left-[calc(50%+10rem)] before:-translate-x-1/2 before:-translate-y-1/2 before:z-[-1] before:absolute before:bg-[radial-gradient(circle_farthest-corner_at_0_0,_hsl(var(--background))_20%,_hsl(var(--primary))_65%,_hsl(var(--secondary))_80%,_hsl(var(--background))_110%),radial-gradient(closest-side_at_60%_50%,_hsl(var(--secondary))_20%,_hsl(var(--background))_100%)]",
        )}
      >
        <Heading level={2} className="text-7xl mb-2">
          Saves
        </Heading>
        <Text className="text-xl mb-20">A chill little bookmark manager.</Text>
      </section>
    </article>
  );
}
