"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import * as React from "react";

export const THEME_STYLES = [
    {
        value: "burgundy",
        label: "Burgundy",
        swatch: "#66434f",
    },
    {
        value: "verdant",
        label: "Verdant",
        swatch: "#1e675b",
    },
    {
        value: "cerulean",
        label: "Cerulean",
        swatch: "#32649b",
    },
] as const;

export const THEME_MODES = ["system", "light", "dark"] as const;

export type ThemeStyle = (typeof THEME_STYLES)[number]["value"];

export type ThemeMode = (typeof THEME_MODES)[number];

export type AppTheme = `${ThemeStyle}-${ThemeMode}`;

export const DEFAULT_THEME: AppTheme = "burgundy-system";

const THEME_NAMES = THEME_STYLES.flatMap(({ value: style }) =>
    THEME_MODES.map((mode) => `${style}-${mode}` as AppTheme),
);

export function isThemeStyle(value: string): value is ThemeStyle {
    return THEME_STYLES.some((style) => style.value === value);
}

export function isThemeMode(value: string): value is ThemeMode {
    return THEME_MODES.some((mode) => mode === value);
}

export function buildTheme(style: ThemeStyle, mode: ThemeMode): AppTheme {
    return `${style}-${mode}`;
}

export function parseTheme(theme: string | undefined): {
    style: ThemeStyle;
    mode: ThemeMode;
} {
    if (!theme) {
        return {
            style: "burgundy",
            mode: "system",
        };
    }

    for (const mode of THEME_MODES) {
        const suffix = `-${mode}`;

        if (!theme.endsWith(suffix)) {
            continue;
        }

        const style = theme.slice(0, -suffix.length);

        if (isThemeStyle(style)) {
            return {
                style,
                mode,
            };
        }
    }

    return {
        style: "burgundy",
        mode: "system",
    };
}

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider
            attribute="data-theme"
            themes={THEME_NAMES}
            defaultTheme={DEFAULT_THEME}
            enableSystem={false}
            enableColorScheme={false}
            {...props}
        >
            <ThemeHotkey />
            {children}
        </NextThemesProvider>
    );
}

function ThemeHotkey() {
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.defaultPrevented || event.repeat) return;

            if (event.metaKey || event.ctrlKey || event.altKey) return;

            if (event.key.toLowerCase() !== "d") return;

            if (
                event.target instanceof HTMLElement &&
                (event.target.isContentEditable ||
                    event.target.tagName === "INPUT" ||
                    event.target.tagName === "TEXTAREA" ||
                    event.target.tagName === "SELECT")
            )
                return;

            const { style, mode } = parseTheme(theme);

            let currentMode: "light" | "dark";

            if (mode === "system") {
                currentMode = window.matchMedia("(prefers-color-scheme: dark)")
                    .matches
                    ? "dark"
                    : "light";
            } else {
                currentMode = mode;
            }

            const nextMode = currentMode === "dark" ? "light" : "dark";

            setTheme(buildTheme(style, nextMode));
        }

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    });

    return null;
}
