import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authServer } from "@/lib/auth/server";

export const getSession = cache(async () => {
    return authServer.api.getSession({
        headers: await headers(),
    });
});

export async function requireSession() {
    const session = await getSession();

    if (!session?.user) {
        redirect("/auth/login");
    }

    return session;
}
