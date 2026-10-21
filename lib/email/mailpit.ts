import "server-only";

import nodemailer from "nodemailer";
import type { EmailMessage } from "@/lib/email";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "127.0.0.1",
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
});

export async function sendWithMailpit(message: EmailMessage): Promise<void> {
    await transporter.sendMail(message);
}
