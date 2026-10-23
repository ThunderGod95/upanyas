export async function fetcher<T>(
    ...args: Parameters<typeof fetch>
): Promise<T> {
    const response = await fetch(...args);

    if (!response.ok) {
        throw new Error(
            `request failed: ${response.status} ${response.statusText}`,
        );
    }

    return response.json() as Promise<T>;
}
