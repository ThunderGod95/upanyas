import AuthenticatedContent from "@/components/authenticated-content";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";

export default async function MeLayout({ children }: LayoutProps<"/user/me">) {
    return (
        <Suspense fallback={<Loading />}>
            <AuthenticatedContent>{children}</AuthenticatedContent>
        </Suspense>
    );
}

function Loading() {
    return (
        <div
            role="status"
            aria-label="Verifying your session"
            className="flex min-h-[50dvh] items-center justify-center"
        >
            <Spinner />
        </div>
    );
}
