"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";

import {
    buildTheme,
    isThemeMode,
    isThemeStyle,
    parseTheme,
    THEME_STYLES,
} from "./theme-provider";

const subscribe = () => () => {};

export default function ThemeToggle() {
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );

    const { theme, setTheme } = useTheme();
    const { style, mode } = parseTheme(theme);

    const ModeIcon =
        !mounted || mode === "system" ? Monitor : mode === "dark" ? Moon : Sun;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="change appearance"
                    title="Appearance"
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                    <ModeIcon className="size-4.5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-48 rounded-xl p-1.5"
            >
                <DropdownMenuLabel>theme.style</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuRadioGroup
                    value={style}
                    onValueChange={(value) => {
                        if (!isThemeStyle(value)) {
                            return;
                        }

                        setTheme(buildTheme(value, mode));
                    }}
                >
                    {THEME_STYLES.map((item) => (
                        <DropdownMenuRadioItem
                            key={item.value}
                            value={item.value}
                        >
                            <span
                                className="size-3 shrink-0 rounded-full border border-foreground/20"
                                style={{ backgroundColor: item.swatch }}
                            ></span>
                            <span>{item.label}</span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>theme.mode</DropdownMenuLabel>

                <DropdownMenuRadioGroup
                    value={mode}
                    onValueChange={(value) => {
                        if (!isThemeMode(value)) {
                            return;
                        }

                        setTheme(buildTheme(style, value));
                    }}
                >
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
