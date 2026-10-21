import { requireSession } from "@/lib/auth/server/utils";

export default async function AuthenticatedContent({ children }: { children: React.ReactNode }) {
    await requireSession();

    return <>{children}</>;
}
