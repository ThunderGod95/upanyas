"use client";

import {
    ChevronDown,
    LibraryBig,
    LogOut,
    Menu,
    Search,
    UserCircleIcon,
    UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/ui/utils";

const links: { label: string; href: string }[] = [];

function isActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavigation() {
    const pathname = usePathname();

    return (
        <>
            {links.length > 0 && (
                <div aria-hidden="true" className="hidden h-7 w-px bg-border lg:block" />
            )}

            <nav
                aria-label="Primary navigation"
                className="hidden h-full items-center gap-7 lg:flex"
            >
                {links.map(({ label, href }) => {
                    const active = isActive(pathname, href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "relative inline-flex h-full items-center text-[0.825rem] font-medium transition-colors",
                                active
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {label}

                            <span
                                aria-hidden="true"
                                className={cn(
                                    "absolute inset-x-0 bottom-0 h-0.5 bg-ornament transition-opacity",
                                    active ? "opacity-100" : "opacity-0",
                                )}
                            />
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export function MobileNavigation() {
    const pathname = usePathname();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Open navigation"
                    className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
                >
                    <Menu className="size-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={12} className="w-56 rounded-xl p-2">
                {links.map(({ label, href }) => (
                    <DropdownMenuItem key={href} asChild>
                        <Link
                            href={href}
                            aria-current={isActive(pathname, href) ? "page" : undefined}
                            className={cn(
                                "cursor-pointer rounded-lg",
                                isActive(pathname, href) && "bg-accent text-accent-foreground",
                            )}
                        >
                            {label}
                        </Link>
                    </DropdownMenuItem>
                ))}

                {links.length > 0 && <DropdownMenuSeparator />}

                <DropdownMenuItem asChild>
                    <Link href="/search" className="cursor-pointer gap-2 rounded-lg">
                        <Search className="size-4" />
                        Search novels
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function AccountMenu({ name, email }: { name: string; email: string }) {
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState("");

    const initial = name.trim().charAt(0).toUpperCase() || "U";

    async function handleSignOut() {
        if (signingOut) return;

        setSigningOut(true);
        setError("");

        try {
            const { error } = await authClient.signOut();

            if (error) {
                setError(error.message ?? "Unable to sign out.");
                return;
            }

            router.replace("/");
            router.refresh();
        } catch {
            setError("Unable to sign out. Please try again.");
        } finally {
            setSigningOut(false);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    aria-label={`Account menu for ${name}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card py-1 pr-2 pl-1 transition-colors hover:bg-secondary sm:pr-3"
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                        {initial}
                    </span>

                    <span className="hidden max-w-28 truncate text-[0.825rem] font-medium text-foreground sm:block">
                        {name}
                    </span>

                    <ChevronDown
                        aria-hidden="true"
                        className="hidden size-3.5 text-muted-foreground sm:block"
                    />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={12} className="w-60 rounded-xl p-2">
                <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-2">
                    <span className="truncate text-sm font-semibold">{name}</span>

                    <span className="truncate text-xs font-normal text-muted-foreground">
                        {email}
                    </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/account">
                        <UserRoundCog className="size-4" />
                        Account Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={`/users/${name}`}>
                        <UserCircleIcon className="size-4" />
                        User Profile
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/library">
                        <LibraryBig className="size-4" />
                        Library
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={signingOut}
                    onSelect={(event) => {
                        event.preventDefault();
                        void handleSignOut();
                    }}
                    className="cursor-pointer gap-2"
                >
                    <LogOut className="size-4" />
                    {signingOut ? "Signing out..." : "Log out"}
                </DropdownMenuItem>

                {error && (
                    <p role="alert" className="px-2 py-1 text-xs text-destructive">
                        {error}
                    </p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
