import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

import { apiError, validOrigin } from "@/lib/apiUtils";
import { authServer } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";
import {
    AVATAR_BUCKET,
    avatarPublicUrl,
    ownedAvatarKey,
    s3,
} from "@/lib/storage/s3";

const MAX_SIZE = 2 * 1024 * 1024;
const MAX_PIXELS = 16_000_000;

const formats: Record<string, string> = {
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

async function deleteObject(key: string) {
    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: AVATAR_BUCKET,
                Key: key,
            }),
        );
    } catch (cause) {
        console.error("avatar cleanup failed:", key, cause);
    }
}

export async function POST(request: NextRequest) {
    if (!validOrigin(request)) {
        return apiError("forbidden origin", 403);
    }

    const session = await authServer.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return apiError("unauthorized", 401);
    }

    const contentLength = Number(request.headers.get("content-length"));

    if (contentLength > 3 * 1024 * 1024) {
        return apiError("request too large", 413);
    }

    if (
        !request.headers
            .get("content-type")
            ?.toLowerCase()
            .startsWith("multipart/form-data")
    ) {
        return apiError("expected multipart form data.", 415);
    }

    let file: FormDataEntryValue | null;

    try {
        const form = await request.formData();
        file = form.get("file");
    } catch {
        return apiError("invalid form data.", 400);
    }

    if (!(file instanceof File)) {
        return apiError("image is required.", 400);
    }

    if (file.size === 0 || file.size > MAX_SIZE) {
        return apiError("image must be 2 MiB or smaller.", 413);
    }

    if (!Object.values(formats).includes(file.type)) {
        return apiError("unsupported image format.", 415);
    }

    let processed: Buffer;

    try {
        const input = sharp(Buffer.from(await file.arrayBuffer()), {
            limitInputPixels: MAX_PIXELS,
        });

        const metadata = await input.metadata();

        if (
            !metadata.format ||
            formats[metadata.format] !== file.type ||
            !metadata.width ||
            !metadata.height ||
            (metadata.pages ?? 1) > 1
        ) {
            return apiError("invalid or unsupported image.", 415);
        }

        processed = await input
            .rotate()
            .resize(256, 256, {
                fit: "cover",
                position: "attention",
            })
            .webp({ quality: 82 })
            .toBuffer();
    } catch {
        return apiError("unable to process this image.", 422);
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true },
    });

    if (!user) {
        return apiError("user not found.", 404);
    }

    const key = `${userId}/${randomUUID()}.webp`;
    const url = avatarPublicUrl(key);

    try {
        await s3.send(
            new PutObjectCommand({
                Bucket: AVATAR_BUCKET,
                Key: key,
                Body: processed,
                ContentType: "image/webp",
                CacheControl: "public, max-age=31536000, immutable",
            }),
        );
    } catch (cause) {
        console.error("avatar upload failed:", cause);
        return apiError("storage upload failed.", 502);
    }

    try {
        const result = await prisma.user.updateMany({
            where: {
                id: userId,
                image: user.image,
            },
            data: {
                image: url,
            },
        });

        if (result.count !== 1) {
            await deleteObject(key);
            return apiError("avatr changed during upload. retry.", 409);
        }
    } catch (cause) {
        console.error("avatar database update failed:", cause);

        await deleteObject(key);

        return apiError("unable to save avatar.", 500);
    }

    const previousKey = ownedAvatarKey(userId, user.image);

    if (previousKey) {
        await deleteObject(previousKey);
    }

    return NextResponse.json({ url });
}

export async function DELETE(request: NextRequest) {
    if (!validOrigin(request)) {
        return apiError("forbidden origin.", 403);
    }

    const session = await authServer.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return apiError("unauthorized.", 401);
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true },
    });

    if (!user) {
        return apiError("user not found.", 404);
    }

    const result = await prisma.user.updateMany({
        where: { id: userId, image: user.image },
        data: { image: null },
    });

    if (result.count !== 1) {
        return apiError("avatar changed. retry.", 409);
    }

    const key = ownedAvatarKey(userId, user.image);

    if (key) {
        await deleteObject(key);
    }

    return NextResponse.json({ url: null });
}
