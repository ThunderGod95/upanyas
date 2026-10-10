import type { Metadata } from "next";

import { DM_Sans, Newsreader } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { cn } from "@/lib/ui/utils";

const uiFont = DM_Sans({
    subsets: ["latin"],
    variable: "--font-ui",
    display: "swap",
});

const displayFont = Newsreader({
    subsets: ["latin"],
    variable: "--font-display",
    display: "swap",
});

export const metadata: Metadata = {
    title: "NU",
    description: "A NovelUpdates clone.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn("font-sans", uiFont.variable, displayFont.variable)}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
