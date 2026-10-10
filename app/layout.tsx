import type { Metadata } from "next";
import { Nunito_Sans, Raleway } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/ui/utils";
import { ThemeProvider } from "@/components/providers";
import ThemeToggle from "@/components/theme-toggle";

const ralewayHeading = Raleway({
    subsets: ["latin"],
    variable: "--font-heading",
});

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "NU",
    description: "A NovelUpdates clone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={cn(
                "font-sans",
                nunitoSans.variable,
                ralewayHeading.variable,
            )}
            suppressHydrationWarning
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="systen"
                    enableSystem
                >
                    <nav className="fixed top-0 left-0 px-4 flex justify-end items-center h-12 w-full">
                        <ThemeToggle />
                    </nav>
                    <main>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    );
}
