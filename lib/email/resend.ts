import "server-only";
import { Resend } from "resend";

import type { EmailMessage } from "@/lib/email";

let client: Resend | undefined;

function getClient(): Resend {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESENDA_API_KEY is not configured.");
    }

    return (client ??= new Resend(process.env.RESEND_API_KEY));
}

export async function sendWithResend(message: EmailMessage): Promise<void> {
    const { error } = await getClient().emails.send(message);

    if (error) {
        throw new Error(`resend: ${error.message}`);
    }
}
