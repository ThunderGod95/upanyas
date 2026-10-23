export function single(value: string | string[] | undefined) {
    return (Array.isArray(value) ? value[0] : (value ?? ""))
        .trim()
        .slice(0, 100);
}

export function multiple(value: string | string[] | undefined) {
    const values = Array.isArray(value) ? value : value ? [value] : [];

    return [...new Set(values.map((v) => v.trim().slice(0, 100)))]
        .filter(Boolean)
        .slice(0, 24);
}
