import "server-only";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { username } from "better-auth/plugins";

import { prisma } from "@/lib/prisma";

export const authServer = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    plugins: [username()],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (
                ctx.path === "/update-user" &&
                ctx.body &&
                typeof ctx.body === "object" &&
                "image" in ctx.body
            ) {
                throw new APIError("FORBIDDEN", {
                    message: "use the avatar upload endpoint to change your image.",
                });
            }
        }),
    },
});
