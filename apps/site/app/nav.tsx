import { Action } from "@local/components/action";
import { Heading } from "@local/components/heading";
import { ActiveLink } from "@local/components/link";
import {
  BookmarkPlusIcon,
  BoxesIcon,
  //   ChevronDown,
  CircleUser,
  LibraryIcon,
  LogOut,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import NextImage from "next/image";
import NextLink from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getAndValidateUser } from "~/database/auth-adapter";
import { logout } from "./root.actions";

export async function Nav() {
  let [userResult] = await Promise.allSettled([getAndValidateUser()]);

  let user = userResult.status === "fulfilled" ? userResult.value.user : null;

  return (
    <header className="py-5 px-8">
      <nav className="flex justify-between items-center">
        <ul className="flex gap-1 md:gap-4 items-center">
          <li className="mr-2 md:mr-10">
            <Heading level={1}>
              <ActiveLink
                className="flex items-center"
                href={user ? "/app" : "/"}
              >
                <NextImage
                  className="inline-flex mr-2"
                  width={48}
                  height={48}
                  //   src="/icons/apple-touch-icon/apple-touch-icon-60x60.png"
                  src="/icons/favicons/favicon-48x48.png"
                  alt=""
                />
                Saves
              </ActiveLink>
            </Heading>
          </li>

          {!user ? (
            <>
              <li>
                <ActiveLink href="/about">About</ActiveLink>
              </li>
              <li>
                <ActiveLink href="/pricing">Pricing</ActiveLink>
              </li>
            </>
          ) : null}
        </ul>
        {user ? (
          <div className="flex items-center gap-2">
            <Action size="sm" variant="primary" is={NextLink} href="/app/new">
              <BookmarkPlusIcon className="-ml-1 mr-2 inline-flex self-center" />{" "}
              Add <span className="sr-only">new bookmark</span>
            </Action>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Action is="button" variant="text">
                  {user.avatarURL ? (
                    <Avatar>
                      <AvatarImage src={user.avatarURL} />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <CircleUser size={32} />
                  )}
                </Action>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {/* <DropdownMenuItem>
                    <ActiveLink className="grow justify-start" href="/app/new">
                      <PlusIcon className="mr-2 inline-flex self-center" /> New
                      Kit
                    </ActiveLink>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <ActiveLink
                      className="grow justify-start"
                      href={`/app/library`}
                    >
                      <LibraryIcon className="mr-2 inline-flex self-center" />{" "}
                      Library
                    </ActiveLink>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ActiveLink
                      className="grow justify-start"
                      href="/app/account"
                    >
                      <CircleUser className="mr-2 inline-flex self-center" />{" "}
                      Account
                    </ActiveLink>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <ActiveLink
                      className="grow justify-start"
                      disabled
                      variant="text"
                      href={`/app/team}`}
                    >
                      <UsersIcon className="mr-2 inline-flex self-center" />{" "}
                      Team (coming soon)
                    </ActiveLink>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <form action={logout}>
                      <Action
                        className="grow justify-start"
                        is="button"
                        type="submit"
                        variant="text"
                      >
                        <LogOut className="mr-2 inline-flex self-center" /> Sign
                        out
                      </Action>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <ActiveLink href="/api/auth/login">Login With GitHub</ActiveLink>
        )}
      </nav>
    </header>
  );
}
