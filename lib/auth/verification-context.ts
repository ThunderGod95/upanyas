const KEY = "upanyas:pending-verification";
const MAX_AGE = 60 * 60 * 1000;

export function savePendingVerification(email: string) {
    sessionStorage.setItem(
        KEY,
        JSON.stringify({
            email: email.trim(),
            createdAt: Date.now(),
        }),
    );
}

export function readPendingVerification(): string | null {
    try {
        const raw = sessionStorage.getItem(KEY);

        if (!raw) return null;

        const data = JSON.parse(raw);

        if (
            typeof data.email !== "string" ||
            typeof data.createdAt !== "number" ||
            Date.now() - data.createdAt > MAX_AGE ||
            data.createdAt > Date.now()
        ) {
            sessionStorage.removeItem(KEY);
            return null;
        }

        return data.email;
    } catch {
        return null;
    }
}
