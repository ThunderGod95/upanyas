"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Change appearance"
                    title="Appearance"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    <Sun aria-hidden="true" className="size-4.5 dark:hidden" strokeWidth={1.6} />
                    <Moon
                        aria-hidden="true"
                        className="hidden size-4.5 dark:block"
                        strokeWidth={1.6}
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={12} className="w-48 rounded-xl p-1.5">
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                        <Sun className="size-4" strokeWidth={1.7} />
                        Light
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="dark">
                        <Moon className="size-4" strokeWidth={1.7} />
                        Dark
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="system">
                        <Monitor className="size-4" strokeWidth={1.7} />
                        System
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
