import "server-only";
import { sendWithMailpit } from "@/lib/email/mailpit";
import { sendWithResend } from "@/lib/email/resend";

export type EmailInput = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};

export type EmailMessage = EmailInput & {
    from: string;
};

export async function sendEmail(input: EmailInput): Promise<void> {
    const provider = process.env.EMAIL_PROVIDER;
    const from = process.env.EMAIL_FROM;

    if (!from) {
        throw new Error("EMAIL_FROM is not configured.");
    }

    const message: EmailMessage = { ...input, from };

    switch (provider) {
        case "mailpit":
            if (process.env.NODE_ENV === "production") {
                throw new Error("mailpit cannot be used in production");
            }

            return sendWithMailpit(message);
        case "resend":
            return sendWithResend(message);

        default:
            throw new Error(`Invalid EMAIL_PROVIDER: ${provider}`);
    }
}
