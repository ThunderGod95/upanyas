import SiteHeader from "@/components/navigation/site-header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />

            <main id="main-content" className="min-h-[calc(100dvh-(4.5rem + 0.8px))] min-w-0">
                {children}
            </main>
        </>
    );
}
