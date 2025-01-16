import { Heading } from "@local/components/heading";
import { Text } from "@local/components/text";

export default function About() {
  return (
    <article className="grow grid grid-cols-1 justify-center text-center">
      <Heading level={2} className="text-7xl mb-2">
        About
      </Heading>
      <Text className="text-xl mb-20">More details coming soon!</Text>
    </article>
  );
}
