import "server-only";
import { S3Client } from "@aws-sdk/client-s3";

export const AVATAR_BUCKET = process.env.S3_AVATAR_BUCKET ?? "user_avatars";

const publicBaseUrl = process.env.AVATAR_PUBLIC_BASE_URL;

if (!publicBaseUrl) {
    throw new Error("AVATAR_PUBLIC_BASE_URL is missing");
}

const baseUrl = publicBaseUrl.replace(/\/+$/, "");

export const s3 = new S3Client({
    region: process.env.S3_REGION!,
    endpoint: process.env.S3_ENDPOINT!,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_KEY!,
    },
});

export function avatarPublicUrl(key: string): string {
    const path = key.split("/").map(encodeURIComponent).join("/");
    return `${baseUrl}/${path}`;
}

export function ownedAvatarKey(
    userId: string,
    imageUrl: string | null,
): string | null {
    const prefix = `${baseUrl}/${encodeURIComponent(userId)}/`;

    if (!imageUrl?.startsWith(prefix)) return null;

    const filename = imageUrl.slice(prefix.length);

    if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/i.test(
            filename,
        )
    ) {
        return null;
    }

    return `${userId}/${filename}`;
}
