import SiteHeader from "@/components/navigation/site-header";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <SiteHeader />

            <main id="main-content">{children}</main>
        </>
    );
}
