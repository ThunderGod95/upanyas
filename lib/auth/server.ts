import "server-only";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { username } from "better-auth/plugins";
import { after } from "next/server";

import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const authServer = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600,

        sendVerificationEmail: async ({ user, url }) => {
            after(async () => {
                try {
                    await sendEmail({
                        to: user.email,
                        subject: "Verify your Upanyas email",
                        text: `Verify your email address using this link:\n\n${url}\n\nThis link expires in one hour.`,
                    });
                } catch {
                    console.error("verification email failed.");
                }
            });
        },
    },
    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: false,

            sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
                after(async () => {
                    try {
                        await sendEmail({
                            to: user.email,
                            subject: "Confirm your Upanyas email change",
                            text: `A request was made to change your email to ${newEmail}.\n\nApprove this change:\n${url}\n\nIf you didn't request this, do not approve it.`,
                        });
                    } catch (error) {
                        console.error("email change confirmation failed:", error);
                    }
                });
            },
        },
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
