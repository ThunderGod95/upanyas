import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { authServer } from "@/lib/auth/server";

export const getSession = cache(async () => {
    await connection();

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
