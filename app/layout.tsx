import type { Metadata } from "next";

import { DM_Sans, Newsreader } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
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
    title: "Upanyas",
    description:
        "Read light novel, web novel, korean novel and chinese novel online for free. You can find hundreds of english translated light novel, web novel, korean novel and chinese novel which are daily updated!",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn("font-sans", uiFont.variable, displayFont.variable)}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
