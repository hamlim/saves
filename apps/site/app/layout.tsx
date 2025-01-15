import { Text } from "@local/components/text";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "./nav";
import "./globals.css";
import { Action } from "@local/components/action";
import { Heading } from "@local/components/heading";
import { cn } from "@local/utils/cn";
import NextImage from "next/image";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Saves",
  description: "A chill little bookmark manager.",
  icons: [
    {
      url: "/icons/favicon.ico",
      rel: "icon",
      type: "image/x-icon",
    },
    {
      url: "/icons/favicon/favicon-16x16.png",
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
    },
    {
      url: "/icons/favicon/favicon-32x32.png",
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
    },
    {
      url: "/icons/favicon/favicon-48x48.png",
      rel: "icon",
      type: "image/png",
      sizes: "48x48",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-57x57.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "57x57",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-60x60.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "60x60",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-72x72.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "72x72",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-76x76.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "76x76",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-114x114.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "114x114",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-120x120.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "120x120",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-144x144.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "144x144",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-152x152.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "152x152",
    },
    {
      url: "/icons/apple-touch-icon/apple-touch-icon-180x180.png",
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "180x180",
    },
  ],
};

function themeCheck() {
  let prefersDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let preferred = prefersDarkModeQuery.matches ? "dark" : "light";
  document.documentElement.classList.add(preferred);
  prefersDarkModeQuery.addEventListener("change", (e) => {
    let newPreferred = e.matches ? "dark" : "light";
    document.documentElement.classList.remove(preferred);
    document.documentElement.classList.add(newPreferred);
    preferred = newPreferred;
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          // biome-ignore lint/security/noDangerouslySetInnerHtml: need to inject the script contents
          dangerouslySetInnerHTML={{
            __html: `(${themeCheck.toString()})()`,
          }}
        />
      </head>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <main className="min-h-[100vh] min-w-[100vw] flex flex-col">
          <Nav />
          {children}
          <footer className="flex items-center justify-between py-5 px-8">
            <div>
              <Heading level={3} className="flex items-center mb-2">
                <NextImage
                  className="inline-flex mr-2"
                  width={16}
                  height={16}
                  src="/icons/favicons/favicon-16x16.png"
                  alt=""
                />
                Saves
              </Heading>
              <Text>Built by Forge Labs</Text>
            </div>
            <Text>
              <Action
                variant="text"
                is="a"
                href="mailto:matthewjameshamlin@gmail.com"
              >
                Contact Us
              </Action>
            </Text>
          </footer>
        </main>
      </body>
    </html>
  );
}
