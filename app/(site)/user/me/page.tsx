import ProfileEditor from "@/components/users/profile-editor";
import { requireSession } from "@/lib/auth/server/utils";

export default async function MePage() {
    const { user } = await requireSession();

    const memberSince = new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(user.createdAt));

    return (
        <ProfileEditor
            user={{
                name: user.name,
                username: user.username ?? "",
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image ?? null,
            }}
            memberSince={memberSince}
        />
    );
}
