import "server-only";
import { NextRequest, NextResponse } from "next/server";

export function apiError(message: string, status: number) {
    return NextResponse.json({ error: message }, { status });
}

export function validOrigin(request: NextRequest) {
    return request.headers.get("origin") === request.nextUrl.origin;
}
